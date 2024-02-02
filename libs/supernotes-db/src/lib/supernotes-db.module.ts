import { Module } from '@nestjs/common';
import { SuperNotesDbService } from './supernotes-db.service';

@Module({
  providers: [SuperNotesDbService],
})
export class SuperNotesModule {}
