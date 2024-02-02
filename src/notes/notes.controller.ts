import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateNote } from '@super-notes/core/features/notes/create-note';
import { GetNotes } from '@super-notes/core/features/notes/get-notes';
import { Note } from '@super-notes/db-lib';
import { CreateNoteDto } from '@super-notes/shared-models';

@Controller('notes')
export class NotesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createNote(@Body() createNoteDto: CreateNoteDto) {
    try {
      const command = new CreateNote.Command(createNoteDto);
      const note = (await this.commandBus.execute(command)) as Note;
      return note;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get()
  async getNotes() {
    try {
      const query = new GetNotes.Query();
      const notes = (await this.queryBus.execute(query)) as Note[];
      return notes;
    } catch (error) {
      throw new Error(error);
    }
  }
}
