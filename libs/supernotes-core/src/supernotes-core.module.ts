import { Module } from '@nestjs/common';
import { NotesModule } from './features/notes/notes.module';

@Module({
  imports: [NotesModule],
  exports: [NotesModule],
})
export class SuperNotesCoreModule {}
