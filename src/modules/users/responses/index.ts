import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

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
