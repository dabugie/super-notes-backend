import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaClient } from '@super-notes/db-lib';
import { NoNoteExistsException } from './exceptions/NoNoteExistsException';

class Query {
  constructor(
    public readonly userId: string,
    public readonly noteId: string,
  ) {}
}
@QueryHandler(Query)
class Handler implements IQueryHandler<Query> {
  client = new PrismaClient();
  logger = new Logger('GetNotesById.Handler');

  async execute(query: Query) {
    try {
      this.logger.log(`Getting note with id ${query.noteId}`);

      const note = await this.client.note.findUnique({
        where: {
          id: query.noteId,
          userId: query.userId,
        },
      });

      if (!note) {
        throw new NoNoteExistsException(query.noteId);
      }

      return note;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}

export const GetNotesById = { Query, Handler };
