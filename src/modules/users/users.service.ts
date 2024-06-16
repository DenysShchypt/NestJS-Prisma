import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { APP_USER_FIELDS, USER_SELECT_FIELDS } from '../../common/constants';
import { AppErrors } from 'src/common/errors';
import { RegisterUserDTO } from '../auth/dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private async hashPassword(
    password: string | Buffer,
    salt: string,
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public async getPublicUser(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      select: USER_SELECT_FIELDS,
    });
  }

  async getUserAllInfo(emailOrId: number | string) {
    return await this.prisma.user.findUnique({
      where:
        typeof emailOrId === 'string'
          ? { email: emailOrId }
          : { id: emailOrId },
      select: APP_USER_FIELDS,
    });
  }

  public async createUser(dto: RegisterUserDTO): Promise<any | boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user) return true;
    const salt = await bcrypt.genSalt();
    dto.password = await this.hashPassword(dto.password, salt);
    return await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: dto.password,
        wallet: dto.wallet,
        roles: ['USER'],
      },
      select: USER_SELECT_FIELDS,
    });
  }
  public async deleteUser(id: number): Promise<void | Error> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return new BadRequestException(AppErrors.USER_NOT_FOUND);
    await this.prisma.user.delete({ where: { id } });
  }
  public async updateUser(dto: any) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.id } });
    if (!user) return new BadRequestException(AppErrors.USER_NOT_FOUND);
    return await this.prisma.user.update({
      where: { id: dto.id },
      data: {
        email: dto.email,
        name: dto.name,
        wallet: dto.wallet,
      },
    });
  }
}
