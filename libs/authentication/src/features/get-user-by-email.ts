import { PrismaClient } from '@super-notes/db-lib';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { NoUserExistsWithEmalException } from '../exceptions/NoUserExistsException';

class Query {
  constructor(public readonly email: string) {}
}

@QueryHandler(Query)
class Handler implements IQueryHandler<Query> {
  client = new PrismaClient();

  async execute(query: Query) {
    const user = (
      await this.client.user.findMany({
        where: {
          email: {
            equals: query.email,
            mode: 'insensitive',
          },
        },
      })
    )[0];

    if (!user) {
      throw new NoUserExistsWithEmalException(query.email);
    }

    return user;
  }
}

export const GetUserByEmail = { Query, Handler };
