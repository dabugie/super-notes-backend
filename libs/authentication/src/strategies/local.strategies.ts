import { PrismaClient } from '@super-notes/db-lib';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { NoUserExistsWithEmalException } from '../exceptions/NoUserExistsException';

export interface JwtPayload {
  email: string;
}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  client = new PrismaClient();

  constructor(configService: ConfigService) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { email } = payload;

    const user = await this.client.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NoUserExistsWithEmalException(email);
    }

    return user;
  }
}
