import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPlayLoad, IUserJWT } from '../common/interfaces/auth';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }
  async validate(payload: IJwtPlayLoad): Promise<IUserJWT> {
    const user = await this.userService
      .getPublicUser(payload.user.email)
      .catch((error) => {
        this.logger.error(`Error during validate JWT: ${error.message}`);
        return null;
      });
    if (!user) throw new UnauthorizedException();
    return { ...payload.user };
  }
}
