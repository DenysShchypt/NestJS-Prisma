import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { add } from 'date-fns';
import { v4 } from 'uuid';
import { IAccessToken, IToken } from 'src/common/interfaces/auth';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}
  public async generateJwtToken(user: {
    email: string;
    id: string;
  }): Promise<IToken> {
    const payload = { user };
    const token =
      'Bearer ' +
      this.jwtService.sign(payload, {
        secret: this.configService.get('secret'),
        expiresIn: this.configService.get('expireJwt'),
      });
    const refreshToken = await this.generateRefreshToken(user.id);
    return {
      token,
      refreshToken,
    };
  }

  public async generateRefreshToken(id: string): Promise<IAccessToken> {
    return this.prisma.token.create({
      data: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
        userId: id,
      },
    });
  }
}
