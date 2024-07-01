import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { add } from 'date-fns';
import { v4 } from 'uuid';
import { IAccessToken, IJWTUser, IToken } from 'src/common/interfaces/auth';
import { AppErrors } from 'src/common/errors';
import { UsersService } from '../users/users.service';
import { UserResponseInfo } from '../users/responses';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
  ) {}

  private async generateToken(
    user: IJWTUser | UserResponseInfo,
  ): Promise<IToken> {
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
  public async generateJwtToken(user: IJWTUser): Promise<IToken> {
    return await this.generateToken(user);
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
  async refreshTokens(refreshToken: string): Promise<IToken> {
    const token = await this.prisma.token.findUnique({
      where: { token: refreshToken },
    });
    if (!token)
      throw new BadRequestException(AppErrors.WRONG_EMAIL_OR_PASSWORD);
    await this.prisma.token.delete({
      where: { token: refreshToken },
    });
    if (new Date(token.exp) < new Date()) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.getPublicUser(token.userId);
    return await this.generateToken(user);
  }
}
