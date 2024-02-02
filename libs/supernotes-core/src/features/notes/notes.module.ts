import { Module } from '@nestjs/common';
import { CreateNote } from './create-note';
import { GetNotes } from './get-notes';

export const QueryHandlers = [GetNotes.Handler];

export const CommandHandlers = [CreateNote.Handler];

@Module({
  imports: [],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class NotesModule {}
