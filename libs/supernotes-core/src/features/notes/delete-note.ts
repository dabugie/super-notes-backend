import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaClient } from '@super-notes/db-lib';
import { NoNoteExistsException } from './exceptions/NoNoteExistsException';

class Query {
  constructor(
    public userId: string,
    public readonly noteId: string,
  ) {}
}

@QueryHandler(Query)
class Handler implements IQueryHandler<Query> {
  client = new PrismaClient();
  logger = new Logger('DeleteNote.Handler');

  async execute(query: Query) {
    try {
      this.logger.log(
        `Getting note: ${query.noteId} for user: ${query.userId}`,
      );

      const note = await this.client.note.findFirst({
        where: {
          id: query.noteId,
          userId: query.userId,
          isActive: true,
        },
      });

      if (!note) {
        throw new NoNoteExistsException(query.noteId);
      }

      const deletedNote = await this.client.note.update({
        where: {
          id: query.noteId,
        },
        data: {
          isActive: false,
          deletedAt: new Date(),
        },
      });

      this.logger.log(`Deleted note: ${query.noteId}`);

      return deletedNote;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export const DeleteNote = { Query, Handler };
