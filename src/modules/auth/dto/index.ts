import { IsPasswordsMatching } from '@common/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, Validate } from 'class-validator';

export class RegisterUserDTO {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: 'John' })
  @IsString()
  name: string;
  @ApiProperty({ example: 'qwerty@123456Q' })
  @IsString()
  password: string;
  @ApiProperty({ example: 'qwerty@123456Q' })
  @IsString()
  @Validate(IsPasswordsMatching)
  passwordRepeat: string;
  @ApiProperty({ example: 1 })
  @IsNumber()
  wallet?: number;
}

export class LoginUserDTO {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: 'qwerty@123456Q' })
  @IsString()
  password: string;
  @ApiProperty({ example: 'qwerty@123456Q' })
  @IsString()
  passwordRepeat: string;
}
