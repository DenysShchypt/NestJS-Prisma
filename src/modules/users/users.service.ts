import { BadRequestException, Injectable } from '@nestjs/common';
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
import { Role } from 'src/common/interfaces/auth';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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
  ): Promise<UserResponseInfo | Error> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ id: idOrEmail }, { email: idOrEmail }],
      },
      select: USER_SELECT_FIELDS,
    });
    if (!user) throw new BadRequestException(AppErrors.USER_NOT_FOUND);
    return user as UserResponseInfo;
  }

  public async getUserAllInfo(idOrEmail: string) {
    return await this.prisma.user.findFirst({
      // where: {
      //   OR: [{ id: idOrEmail }, { email: idOrEmail }],
      // },
      where: (await this.isValidUuid(idOrEmail))
        ? { id: idOrEmail }
        : { email: idOrEmail },
      select: APP_USER_FIELDS,
    });
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
    return (await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: dto.password,
        passwordRepeat: dto.passwordRepeat,
        wallet: dto.wallet,
        roles: [Role.USER],
      },
      select: USER_SELECT_FIELDS,
    })) as UserResponseInfo;
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
      },
      select: USER_UPDATE_FIELDS,
    });
  }

  public async deleteUser(id: string): Promise<void | Error> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return new BadRequestException(AppErrors.USER_NOT_FOUND);
    await this.prisma.user.delete({ where: { id } });
  }
}
