import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      clientID: configService.get<string>('clientID'),
      clientSecret: configService.get<string>('clientSecret'),
      callbackURL: configService.get<string>('callbackURL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    // let user = await this.prisma.user.findUnique({
    //   where: {
    //     email: emails[0].value,
    //   },
    // });

    // if (!user) {
    //   user = await this.prisma.user.create({
    //     data: {
    //       provider: 'google',
    //       providerId: id,
    //       email: emails[0].value,
    //       name: `${name.givenName} ${name.familyName}`,
    //       picture: photos[0].value,
    //     },
    //   });
    // }

    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
    };

    done(null, user);
  }
}
