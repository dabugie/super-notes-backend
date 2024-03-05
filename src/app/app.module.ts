import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationModule } from '@super-notes/authentication/authentication.module';
import { LocalStrategy } from '@super-notes/authentication/strategies/local.strategies';
import { SuperNotesCoreModule } from '@super-notes/core/supernotes-core.module';
import { CorrelationIdMiddleware } from 'src/shared/middlewares/correlation-id.middleware';
import { AuthenticationController } from './authentication/authentication.controller';
import { NotesController } from './notes/notes.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'local' }),
    SuperNotesCoreModule,
    AuthenticationModule,
    CqrsModule,
  ],
  controllers: [AuthenticationController, NotesController],
  providers: [LocalStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
