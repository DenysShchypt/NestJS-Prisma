import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class RegisterUserDTO {
  @ApiProperty({ example: 'john@example.com' })
  @IsString()
  email: string;
  @ApiProperty({ example: 'John' })
  @IsString()
  name: string;
  @ApiProperty({ example: 'qwerty@123456Q' })
  @IsString()
  password: string;
  @ApiProperty({ example: 1 })
  @IsNumber()
  wallet: number;
}

export class LoginUserDTO {
  @ApiProperty({ example: 'john@example.com' })
  @IsString()
  email: string;
  @ApiProperty({ example: 'qwerty@123456Q' })
  @IsString()
  password: string;
}
