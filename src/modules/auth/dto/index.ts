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
export class GoogleUserDTO {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: 'google' })
  @IsString()
  provider: string;
  @ApiProperty({ example: '46478642345867234548645' })
  @IsString()
  providerId: string;
  @ApiProperty({ example: 'Denys Developer' })
  @IsString()
  name: string;
  @ApiProperty({
    example:
      'https://lh3.googleusercontent.com/a/ACg8ocJ-OcEr6cr50Ak6Sz7LGMK6MXRH44O0ULhXbAtpn6lMa0OGlgQ=s96-c',
  })
  @IsString()
  picture: string;
}
