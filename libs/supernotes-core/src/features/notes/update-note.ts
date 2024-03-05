import { Logger } from '@nestjs/common';
import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { NoUserExistsException } from '@super-notes/authentication/exceptions/NoUserExistsException';
import { PrismaClient } from '@super-notes/db-lib';
import { CreateNoteDto } from '@super-notes/shared-models';
import { NoNoteExistsException } from './exceptions/NoNoteExistsException';

class Command {
  constructor(
    public readonly noteId: string,
    public readonly userId: string,
    public readonly createNoteDto: CreateNoteDto,
  ) {}
}

@CommandHandler(Command)
class Handler implements IQueryHandler<Command> {
  client = new PrismaClient();
  logger = new Logger('UpdateNote.Handler');

  async execute(command: Command) {
    try {
      this.logger.log(`Getting user: ${command.userId}`);
      const existingUser = await this.client.user.findUnique({
        where: {
          id: command.userId,
        },
      });
      if (!existingUser) {
        throw new NoUserExistsException(command.userId);
      }
      this.logger.log(`Getting note: ${command.noteId}`);

      const existingNote = await this.client.note.findUnique({
        where: {
          id: command.noteId,
        },
      });
      if (!existingNote) {
        throw new NoNoteExistsException(command.noteId);
      }
      this.logger.log(`Updating note: ${command.noteId}`);
      const note = await this.client.note.update({
        where: {
          id: command.noteId,
        },
        data: {
          title: command.createNoteDto.title,
          content: command.createNoteDto.content,
        },
      });

      this.logger.log(
        `Updated note: ${command.noteId} for user: ${command.userId}`,
      );

      return note;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export const UpdateNote = { Command, Handler };
