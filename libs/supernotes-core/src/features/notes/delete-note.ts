import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { PrismaClient } from '@super-notes/db-lib';
import { NoNoteExistsException } from './exceptions/NoNoteExistsException';

class Command {
  constructor(public readonly noteId: string) {}
}

@CommandHandler(Command)
class Handler implements IQueryHandler<Command> {
  client = new PrismaClient();

  async execute(command: Command) {
    const note = await this.client.note.update({
      where: {
        id: command.noteId,
      },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });

    if (!note) {
      throw new NoNoteExistsException(command.noteId);
    }
  }
}

export const DeleteNote = { Command, Handler };
