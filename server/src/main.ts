import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  await app.listen(port);
}
bootstrap();
