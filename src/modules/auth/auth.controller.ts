import {
  BadRequestException,
  Body,
  Controller,
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
import { AppErrors } from 'src/common/errors';

@ApiTags('API')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
  @ApiResponse({ status: 201, type: RegisterUserResponse })
  @Post('register')
  registerUser(
    @Body() dto: RegisterUserDTO,
  ): Promise<RegisterUserResponse | Error> {
    return this.authService.registerUser(dto);
  }
  @ApiResponse({ status: 201 })
  @Post('login')
  async loginUser(@Body() dto: LoginUserDTO, @Res() res: Response) {
    const user = await this.authService.loginUser(dto);
    this.setRefreshTokenToCookies(user, res);
  }

  private setRefreshTokenToCookies(tokens: IToken, res: Response) {
    if (!tokens) throw new UnauthorizedException();

    res.cookie('refreshToken', tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(tokens.refreshToken.exp),
      secure:
        this.configService.get('NODE_ENV', 'development') === 'production',
      path: '/',
    });
    res.status(HttpStatus.CREATED).json(tokens);
  }
}
