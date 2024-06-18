import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

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
  wallet: number;
  @ApiProperty({ example: 1 })
  @Expose()
  @IsNumber()
  id: number;
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiZHV5dUB1a3IubmV0In0sImlhdCI6MTcxODcyMjY3NiwiZXhwIjoxNzE4ODA5MDc2fQ.CwnOiN5RvZzURWpdGM8q5HTdaFN2sjBNIe2poP2jQgY',
  })
  @IsString()
  token: string;
}
