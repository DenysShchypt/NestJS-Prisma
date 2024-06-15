import { IsNumber, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  email: string;
  @IsString()
  name: string;
  @IsString()
  password: string;
  @IsNumber()
  wallet: number;
}
export class LoginUserDTO {
  @IsString()
  email: string;
  @IsString()
  password: string;
}
