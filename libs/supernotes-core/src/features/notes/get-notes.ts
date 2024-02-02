import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaClient } from '@super-notes/db-lib';

class Query {
  constructor() {}
}

@QueryHandler(Query)
class Handler implements IQueryHandler<Query> {
  client = new PrismaClient();

  async execute(query: Query) {
    try {
      console.log({ query });
      const notes = await this.client.note.findMany();
      return notes;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export const GetNotes = { Query, Handler };
