import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { TokenModule } from '../token/token.module';
import { JwtStrategy } from 'src/strategy';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleStrategy } from 'src/strategy/google.strategy';

@Module({
  imports: [UsersModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService, GoogleStrategy],
})
export class AuthModule {}
