import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { existsSync, mkdir } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  if (!existsSync(process.env.SONG_FOLDER)) {
    mkdir(process.env.SONG_FOLDER, (err) => {
      console.log(err);
    });
  }

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(+process.env.PORT);
}
bootstrap();
