import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from '../../common/dto/user';
import * as bcrypt from 'bcrypt';
import { APP_USER_FIELDS, USER_SELECT_FIELDS } from '../../common/constants';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  public async createUser(dto: CreateUserDTO) {
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
      },
      select: USER_SELECT_FIELDS,
    });
  }

  public async getPublicUser(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      select: USER_SELECT_FIELDS,
    });
  }
  public async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      select: APP_USER_FIELDS,
    });
  }

  private async hashPassword(password, salt) {
    return await bcrypt.hash(password, salt);
  }
}
