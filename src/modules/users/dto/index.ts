import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  ArrayNotEmpty,
  IsAlpha,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UserUpdateAdminDTO {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  @IsAlpha('en-US', {
    message: 'Field must contain only Latin alphabet characters',
  })
  name?: string;
  @ApiProperty({ example: 'john@example.com' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email?: string;
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  wallet?: number;
  @ApiProperty({ example: ['ADMIN', 'USER'], enum: Role, isArray: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Role, { each: true })
  roles?: Role[];
}
export class UserUpdateDTO {
  @ApiProperty({ example: 'John' })
  @IsOptional()
  @IsString()
  @Length(3, 20)
  @IsAlpha('en-US', {
    message: 'Field must contain only Latin alphabet characters',
  })
  name?: string;
  @ApiProperty({ example: 'john@example.com' })
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  wallet?: number;
  @ApiProperty({
    example:
      'https://lh3.googleusercontent.com/a/ACg8ocJ-OcEr6cr50Ak6Sz7LGMK6MXRH44O0ULhXbAtpn6lMa0OGlgQ=s96-c',
  })
  @IsString()
  picture?: string;
}
