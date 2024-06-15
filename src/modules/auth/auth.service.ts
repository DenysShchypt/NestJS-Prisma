import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDTO, LoginUserDTO } from '../../common/dto/user';
import { TokenService } from '../token/token.service';
import { AppErrors } from '../../common/errors';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) {}
  public async registerUser(dto: CreateUserDTO) {
    const newUser = await this.userService.createUser(dto);
    if (newUser === true) return new BadRequestException(AppErrors.USER_EXISTS);
    const payload = {
      email: dto.email,
    };
    const token = await this.tokenService.generateJwtToken(payload);
    return {
      ...newUser,
      token,
    };
  }

  public async loginUser(dto: LoginUserDTO) {
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) return new BadRequestException(AppErrors.USER_NOT_FOUND);
    const checkPassword = await bcrypt.compare(dto.password, user.password);
    if (!checkPassword)
      return new BadRequestException(AppErrors.WRONG_PASSWORD);
    delete user.password;
    const payload = {
      email: dto.email,
    };
    const token = await this.tokenService.generateJwtToken(payload);
    return {
      ...user,
      token,
    };
  }
}
