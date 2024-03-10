import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaClient } from '@super-notes/db-lib';

class Query {
  constructor(public readonly userId: string) {}
}

@QueryHandler(Query)
class Handler implements IQueryHandler<Query> {
  client = new PrismaClient();
  logger = new Logger('GetNotes.Handler');

  async execute(query: Query) {
    try {
      this.logger.log(`Getting notes for user: ${query.userId}`);

      const notes = await this.client.note.findMany({
        where: {
          isActive: true,
          userId: query.userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      this.logger.log(`Found ${notes.length} notes for user: ${query.userId}`);
      return notes;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export const GetNotes = { Query, Handler };
