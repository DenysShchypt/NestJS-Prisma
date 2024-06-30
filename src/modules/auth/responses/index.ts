import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Role } from 'src/common/interfaces/auth';

class RefreshToken {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiZHV5dUB1a3IubmV0In0sImlhdCI6MTcxODcyMjY3NiwiZXhwIjoxNzE4ODA5MDc2fQ.CwnOiN5RvZzURWpdGM8q5HTdaFN2sjBNIe2poP2jQgY',
  })
  @IsString()
  token: string;

  @ApiProperty({ example: '2023-06-19T12:59:10.123Z' })
  @IsString()
  exp: Date;

  @ApiProperty({ example: 1 })
  @IsNumber()
  userId: string;
}
class Token {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiZHV5dUB1a3IubmV0In0sImlhdCI6MTcxODcyMjY3NiwiZXhwIjoxNzE4ODA5MDc2fQ.CwnOiN5RvZzURWpdGM8q5HTdaFN2sjBNIe2poP2jQgY',
  })
  @IsString()
  token: string;
  @ApiProperty({ type: RefreshToken })
  @ValidateNested()
  @Type(() => RefreshToken)
  refreshToken: RefreshToken;
}
export class RegisterUserResponse {
  @ApiProperty({ example: 'John' })
  @Expose()
  @IsString()
  name: string;
  @ApiProperty({ example: 'john@example.com' })
  @Expose()
  @IsString()
  email: string;
  @ApiProperty({ example: 1 })
  @Expose()
  @IsNumber()
  wallet?: number;
  @ApiProperty({ example: 1 })
  @Expose()
  @IsNumber()
  id: string;
  @ApiProperty({ example: ['ADMIN', 'USER'], enum: Role, isArray: true })
  @Expose()
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Role, { each: true })
  roles: Role[];
  @ApiProperty({ type: Token })
  @ValidateNested()
  @Type(() => Token)
  token: Token;
}
