import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TokenService } from '../token/token.service';
import * as bcrypt from 'bcrypt';
import { AppErrors } from 'src/common/errors';
import { RegisterUserDTO, LoginUserDTO } from './dto';
import { RegisterUserResponse } from './responses';
import { PrismaService } from '../prisma/prisma.service';
import { IToken } from 'src/common/interfaces/auth';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService,
  ) {}
  public async registerUser(
    dto: RegisterUserDTO,
  ): Promise<RegisterUserResponse | Error> {
    const newUser = await this.userService.createUser(dto).catch((error) => {
      this.logger.error(`Error during register user: ${error.message}`);
      return null;
    });

    if (newUser === true) return new BadRequestException(AppErrors.USER_EXISTS);
    const dataUser = {
      ...newUser,
      id: newUser.id,
      wallet: 0,
      roles: newUser.roles,
    };
    const payload = {
      email: dto.email,
      id: newUser.id,
      name: newUser.name,
      roles: newUser.roles,
    };
    const token = await this.tokenService.generateJwtToken(payload);
    return {
      ...dataUser,
      token,
    };
  }

  public async loginUser(dto: LoginUserDTO) {
    const user = await this.userService
      .getUserAllInfo(dto.email)
      .catch((error) => {
        this.logger.error(`Error during login user: ${error.message}`);
        return null;
      });
    if (!user) throw new BadRequestException(AppErrors.USER_NOT_FOUND);
    const checkPassword = await bcrypt.compare(dto.password, user.password);
    if (!checkPassword) throw new BadRequestException(AppErrors.WRONG_PASSWORD);
    delete user.password;
    const payload = {
      email: user.email,
      id: user.id,
      name: user.name,
      roles: user.roles,
    };
    const token = await this.tokenService.generateJwtToken(payload);
    return token;
  }

  public async getRefreshTokens(refreshToken: string): Promise<IToken> {
    return await this.tokenService.refreshTokens(refreshToken);
  }
}
