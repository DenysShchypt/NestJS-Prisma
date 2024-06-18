import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO, LoginUserDTO } from './dto';
import { RegisterUserResponse } from './responses';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('API')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiResponse({ status: 201, type: RegisterUserResponse })
  @Post('register')
  registerUser(
    @Body() dto: RegisterUserDTO,
  ): Promise<RegisterUserResponse | Error> {
    return this.authService.registerUser(dto);
  }
  @ApiResponse({ status: 200, type: RegisterUserResponse })
  @Post('login')
  loginUser(@Body() dto: LoginUserDTO): Promise<RegisterUserResponse | Error> {
    return this.authService.loginUser(dto);
  }
}
