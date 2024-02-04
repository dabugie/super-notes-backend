import { Module } from '@nestjs/common';
import { CreateNote } from './create-note';
import { GetNotes } from './get-notes';
import { GetNotesById } from './get-notes-by-id';
import { DeleteNote } from './delete-note';
import { UpdateNote } from './update-note';

export const QueryHandlers = [
  GetNotes.Handler,
  GetNotesById.Handler,
  DeleteNote.Handler,
];

export const CommandHandlers = [CreateNote.Handler, UpdateNote.Handler];

@Module({
  imports: [],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class NotesModule {}
