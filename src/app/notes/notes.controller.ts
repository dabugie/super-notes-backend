import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { CreateNote } from '@super-notes/core/features/notes/create-note';
import { DeleteNote } from '@super-notes/core/features/notes/delete-note';
import { GetNotes } from '@super-notes/core/features/notes/get-notes';
import { GetNotesById } from '@super-notes/core/features/notes/get-notes-by-id';
import { UpdateNote } from '@super-notes/core/features/notes/update-note';
import { Note } from '@super-notes/db-lib';
import { CreateNoteDto } from '@super-notes/shared-models';
import { TokenInterceptor } from 'src/shared/interceptors/token/token.interceptor';
import { UserIdInterceptor } from 'src/shared/interceptors/user-id/user-id.interceptor';

@Controller('notes')
@UseGuards(AuthGuard())
@UseInterceptors(UserIdInterceptor)
@UseInterceptors(TokenExpiredError)
@UseInterceptors(TokenInterceptor)
export class NotesController {
  logger = new Logger(NotesController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createNote(
    @Body() createNoteDto: CreateNoteDto,
    @Param('userId') userId: string,
  ) {
    try {
      const command = new CreateNote.Command(createNoteDto, userId);
      const note = (await this.commandBus.execute(command)) as Note;
      return note;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Get()
  async getNotes(@Param('userId') userId: string) {
    try {
      const query = new GetNotes.Query(userId);
      const notes = await this.queryBus.execute(query);
      return notes;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Get(':noteId')
  async getNoteById(
    @Param('noteId') noteId: string,
    @Param('userId') userId: string,
  ) {
    try {
      const query = new GetNotesById.Query(userId, noteId);
      const note = await this.queryBus.execute(query);
      return note;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Put(':noteId')
  async updateNoteById(
    @Param('noteId') noteId: string,
    @Param('userId') userId: string,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    try {
      const command = new UpdateNote.Command(noteId, userId, createNoteDto);
      const note = (await this.commandBus.execute(command)) as Note;
      return note;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Delete(':noteId')
  async deleteNoteById(
    @Param('userId') userId: string,
    @Param('noteId') noteId: string,
  ) {
    try {
      const command = new DeleteNote.Query(userId, noteId);
      const note = await this.queryBus.execute(command);
      return note;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
