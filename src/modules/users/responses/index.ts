import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { Role } from 'src/common/interfaces/auth';

export class UserResponseInfo {
  @ApiProperty({ example: 'John' })
  @IsString()
  name: string;
  @ApiProperty({ example: 'john@example.com' })
  @IsString()
  email: string;
  @ApiProperty({ example: 1 })
  @IsNumber()
  wallet: number;
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;
  @ApiProperty({ example: ['ADMIN', 'USER'], enum: Role, isArray: true })
  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];
}

export class UpdateUserResponse {
  @ApiProperty({ example: 'John' })
  @IsString()
  name?: string;
  @ApiProperty({ example: 'john@example.com' })
  @IsString()
  email?: string;
  @ApiProperty({ example: 1 })
  @IsNumber()
  wallet?: number;
}