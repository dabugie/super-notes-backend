import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaClient } from '@super-notes/db-lib';
import { CreateNoteDto } from '@super-notes/shared-models';

class Command {
  constructor(
    public readonly createNoteDto: CreateNoteDto,
    public readonly userId: string,
  ) {}
}

@CommandHandler(Command)
class Handler implements ICommandHandler<Command> {
  client = new PrismaClient();

  async execute(command: Command) {
    try {
      const { title, content } = command.createNoteDto;
      const note = await this.client.note.create({
        data: {
          title,
          content,
          user: {
            connect: {
              id: command.userId,
            },
          },
        },
      });

      return note;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export const CreateNote = { Command, Handler };
