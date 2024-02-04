import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateNote } from '@super-notes/core/features/notes/create-note';
import { DeleteNote } from '@super-notes/core/features/notes/delete-note';
import { NoNoteExistsException } from '@super-notes/core/features/notes/exceptions/NoNoteExistsException';
import { GetNotes } from '@super-notes/core/features/notes/get-notes';
import { GetNotesById } from '@super-notes/core/features/notes/get-notes-by-id';
import { UpdateNote } from '@super-notes/core/features/notes/update-note';
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

  @Get(':noteId')
  async getNoteById(@Param('noteId') noteId: string) {
    try {
      const query = new GetNotesById.Query(noteId);
      const note = (await this.queryBus.execute(query)) as Note;
      return note;
    } catch (error) {
      throw new NoNoteExistsException(error);
    }
  }

  @Put(':noteId')
  async updateNoteById(
    @Param('noteId') noteId: string,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    try {
      const command = new UpdateNote.Command(noteId, createNoteDto);
      const note = (await this.commandBus.execute(command)) as Note;
      return note;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':noteId')
  async deleteNoteById(@Param('noteId') noteId: string) {
    try {
      console.log({ noteId });

      const command = new DeleteNote.Command(noteId);
      await this.commandBus.execute(command);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
