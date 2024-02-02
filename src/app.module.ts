import { Module } from '@nestjs/common';
import { NotesController } from './notes/notes.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { SuperNotesDbService } from '@super-notes/db-lib';
import { SuperNotesCoreModule } from '@super-notes/core/supernotes-core.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SuperNotesCoreModule,
    CqrsModule,
    CacheModule.register({ isGlobal: true }),
  ],
  controllers: [NotesController],
  providers: [SuperNotesDbService],
})
export class AppModule {}
