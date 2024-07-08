import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import validator from 'validator';
import {
  APP_USER_FIELDS,
  USER_SELECT_FIELDS,
  USER_UPDATE_FIELDS,
} from '../../common/constants';
import { AppErrors } from 'src/common/errors';
import { RegisterUserDTO } from '../auth/dto';
import { UserUpdateDTO } from './dto';
import { UpdateUserResponse, UserResponseInfo } from './responses';
import { IJWTUser, Role } from 'src/common/interfaces/auth';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { convertToSecondsUtil } from '@common/decorators/utils';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  private async hashPassword(
    password: string | Buffer,
    salt: string,
  ): Promise<string> {
    return bcrypt.hashSync(password, salt);
  }
  private async isValidUuid(val: string): Promise<boolean> {
    return validator.isUUID(val);
  }

  public async getPublicUser(
    idOrEmail: string,
    isReset: boolean = false,
  ): Promise<UserResponseInfo> {
    if (isReset) {
      await this.cacheManager.del(idOrEmail);
    }
    const user = await this.cacheManager.get<UserResponseInfo>(idOrEmail);

    if (!user) {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ id: idOrEmail }, { email: idOrEmail }],
        },
        select: USER_SELECT_FIELDS,
      });
      console.log(user);
      if (!user) throw new BadRequestException(AppErrors.USER_NOT_FOUND);
      await this.cacheManager.set(
        idOrEmail,
        user,
        convertToSecondsUtil(this.configService.get('JWT_EXPIRE')),
      );
      return user as UserResponseInfo;
    }
    return user;
  }

  public async getUserAllInfo(idOrEmail: string, isReset: boolean = false) {
    if (isReset) {
      await this.cacheManager.del(idOrEmail);
    }
    const user = await this.cacheManager.get<UserResponseInfo>(idOrEmail);
    if (!user) {
      const userPrisma = await this.prisma.user.findFirst({
        where: (await this.isValidUuid(idOrEmail))
          ? { id: idOrEmail }
          : { email: idOrEmail },
        select: APP_USER_FIELDS,
      });
      if (!userPrisma) throw new BadRequestException(AppErrors.USER_NOT_FOUND);
      await this.cacheManager.set(
        idOrEmail,
        userPrisma,
        convertToSecondsUtil(this.configService.get('JWT_EXPIRE')),
      );
      return userPrisma;
    }
    return user;
  }

  public async createUser(
    dto: RegisterUserDTO,
  ): Promise<UserResponseInfo | true> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user) return true;
    const salt = await bcrypt.genSalt();
    dto.password = await this.hashPassword(dto.password, salt);
    const createUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: dto.password,
        passwordRepeat: dto.passwordRepeat,
        wallet: dto.wallet,
        roles: [Role.USER],
      },
      select: USER_SELECT_FIELDS,
    });

    await this.cacheManager.set(createUser.id, createUser);
    await this.cacheManager.set(createUser.email, createUser);
    return createUser as UserResponseInfo;
  }
  public async updateUser(
    id: string,
    dto: UserUpdateDTO,
  ): Promise<UpdateUserResponse | Error> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return new BadRequestException(AppErrors.USER_NOT_FOUND);
    return await this.prisma.user.update({
      where: { id },
      data: {
        email: dto.email,
        name: dto.name,
        wallet: dto.wallet,
        picture: dto.picture,
      },
      select: USER_UPDATE_FIELDS,
    });
  }

  public async deleteUser(id: string, userCurrent: IJWTUser) {
    if (userCurrent.id !== id && !userCurrent.roles.includes(Role.ADMIN)) {
      return new BadRequestException(AppErrors.ADMIN_DELETE_USER);
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userCurrent.id },
    });
    if (!user) throw new BadRequestException(AppErrors.USER_NOT_FOUND);
    await Promise.all([
      await this.cacheManager.del(id),
      await this.cacheManager.del(userCurrent.email),
    ]);

    return await this.prisma.user.delete({
      where: { id: user.id },
      select: { id: true },
    });
  }
}
