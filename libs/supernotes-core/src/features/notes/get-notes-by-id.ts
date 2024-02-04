import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaClient } from '@super-notes/db-lib';
import { NoNoteExistsException } from './exceptions/NoNoteExistsException';

class Query {
  constructor(public readonly noteId: string) {}
}
@QueryHandler(Query)
class Handler implements IQueryHandler<Query> {
  client = new PrismaClient();

  async execute(query: Query) {
    const notes = await this.client.note.findUnique({
      where: {
        id: query.noteId,
      },
    });

    if (!notes) {
      throw new NoNoteExistsException(query.noteId);
    }
    return notes;
  }
}

export const GetNotesById = { Query, Handler };
