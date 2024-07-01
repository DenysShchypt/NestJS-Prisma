import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO, LoginUserDTO } from './dto';
import { RegisterUserResponse } from './responses';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IToken } from 'src/common/interfaces/auth';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Cookie } from '@common/decorators';
const REFRESH_TOKEN = 'fresh';
@ApiTags('API')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
  @ApiResponse({ status: 201, type: RegisterUserResponse })
  @Post('register')
  async registerUser(
    @Body() dto: RegisterUserDTO,
  ): Promise<RegisterUserResponse | Error> {
    return await this.authService.registerUser(dto);
  }
  @ApiResponse({ status: 201 })
  @Post('login')
  async loginUser(@Body() dto: LoginUserDTO, @Res() res: Response) {
    const user = await this.authService.loginUser(dto);
    this.setRefreshTokenToCookies(user, res);
  }
  @Get('refresh-tokens')
  async refreshTokens(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
  ) {
    if (!refreshToken) throw new UnauthorizedException();
    const tokens = await this.authService.getRefreshTokens(refreshToken);
    if (!tokens) throw new UnauthorizedException();
    return this.setRefreshTokenToCookies(tokens, res);
  }

  private setRefreshTokenToCookies(tokens: IToken, res: Response) {
    if (!tokens) throw new UnauthorizedException();

    res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(tokens.refreshToken.exp),
      secure:
        this.configService.get('NODE_ENV', 'development') === 'production',
      path: '/',
    });
    res.status(HttpStatus.CREATED).json({ token: tokens.token });
  }
}
