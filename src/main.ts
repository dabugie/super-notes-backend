import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

const app = async () => {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app
    .listen(port)
    .then(() => {
      Logger.log(
        `Application is running on: http://localhost:${port}/${globalPrefix}`,
      );
    })
    .catch((error) => {
      Logger.error(`Application failed to start: ${error}`);
    });
};

app();
