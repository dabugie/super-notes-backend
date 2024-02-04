import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { PrismaClient } from '@super-notes/db-lib';
import { NoNoteExistsException } from './exceptions/NoNoteExistsException';
import { CreateNoteDto } from '@super-notes/shared-models';

class Command {
  constructor(
    public readonly noteId: string,
    public readonly createNoteDto: CreateNoteDto,
  ) {}
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
        title: command.createNoteDto.title,
        content: command.createNoteDto.content,
        updatedAt: new Date(),
      },
    });

    if (!note) {
      throw new NoNoteExistsException(command.noteId);
    }

    return note;
  }
}

export const UpdateNote = { Command, Handler };
