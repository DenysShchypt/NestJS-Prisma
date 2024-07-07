import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO, LoginUserDTO } from './dto';
import { RegisterUserResponse } from './responses';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IToken } from 'src/common/interfaces/auth';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Cookie, UserAgent } from '@common/decorators';
import { GoogleOauthGuard } from 'src/common/guards/google-oauth.guard';
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
    @UserAgent() agent: string,
  ): Promise<RegisterUserResponse | Error> {
    return await this.authService.registerUser(dto, agent);
  }
  @ApiResponse({ status: 201 })
  @Post('login')
  async loginUser(
    @Body() dto: LoginUserDTO,
    @Res() res: Response,
    @UserAgent() agent: string,
  ) {
    const user = await this.authService.loginUser(dto, agent);
    this.setRefreshTokenToCookies(user, res);
  }

  @Get('logout')
  async logout(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
  ) {
    if (!refreshToken) {
      res.sendStatus(HttpStatus.OK);
      return;
    }
    await this.authService.deleteRefreshToken(refreshToken);
    res.cookie(REFRESH_TOKEN, '', {
      httpOnly: true,
      secure: true,
      expires: new Date(),
    });
    res.sendStatus(HttpStatus.OK);
  }

  @Get('refresh-tokens')
  async refreshTokens(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
    @UserAgent() agent: string,
  ) {
    if (!refreshToken) throw new UnauthorizedException();
    const tokens = await this.authService.getRefreshTokens(refreshToken, agent);
    if (!tokens) throw new UnauthorizedException();
    return this.setRefreshTokenToCookies(tokens, res);
  }
  @UseGuards(GoogleOauthGuard)
  @Get('google')
  authGoogle() {}

  @UseGuards(GoogleOauthGuard)
  @Get('google/callback')
  async authGoogleCallback(
    @Req() req,
    @Res() res: Response,
    @UserAgent() agent: string,
  ) {
    const user = await this.authService.enterGoogleAuth(req.user, agent);
    // const user = await this.authService.loginUser(req.user, agent);
    this.setRefreshTokenToCookies(user, res);
    // return res.redirect('http://localhost:4000/api/auth/success');
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
