import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@super-notes/db-lib';

class Query {
  constructor(public readonly authorization: string) {}
}

@QueryHandler(Query)
class Handler implements IQueryHandler<Query> {
  client = new PrismaClient();
  logger = new Logger('SignoutUser.Handler');

  jwtService = new JwtService({
    secret: process.env.JWT_SECRET,
  });

  async execute(query: Query) {
    try {
      this.logger.log(
        `Validating user with authorization ${query.authorization}`,
      );

      if (!query.authorization) {
        throw new Error('Session not found');
      }

      const accessToken = query.authorization.split(' ')[1];
      const payload = this.jwtService.verify(accessToken);

      if (!payload) {
        throw new Error('Invalid token');
      }

      const validateToken = await this.client.blacklistedToken.findUnique({
        where: {
          token: accessToken,
        },
      });

      if (validateToken) {
        throw new Error('Token has already been invalidated');
      }

      this.logger.log(`User with id ${payload.sub} is valid`);

      const user = await this.client.user.findUnique({
        where: {
          id: payload.sub,
        },
      });

      return {
        access_token: query.authorization,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userData: user.userData,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}

export const GetUserStatus = {
  Query,
  Handler,
};
