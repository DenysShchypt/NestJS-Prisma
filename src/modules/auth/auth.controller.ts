import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO, LoginUserDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  registerUser(@Body() dto: RegisterUserDTO) {
    return this.authService.registerUser(dto);
  }
  @Post('login')
  loginUser(@Body() dto: LoginUserDTO) {
    return this.authService.loginUser(dto);
  }
}
