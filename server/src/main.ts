import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { LoggerService } from './services';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const loggerService = app.get(LoggerService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });
  loggerService.log(`CORS enabled with origin: ${corsOrigin}`);

  const port = configService.get<number>('PORT');

  await app.listen(port);
  loggerService.log(`Application is running on port ${port}`);
}
bootstrap();
