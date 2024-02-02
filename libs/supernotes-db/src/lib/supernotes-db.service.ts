import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { SuperNotesClient, Prisma } from './supernotes-db';

@Injectable()
export class SuperNotesDbService
  extends SuperNotesClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleDestroy() {
    await this.$disconnect();
  }
  async onModuleInit() {
    await this.$connect();
  }
}
