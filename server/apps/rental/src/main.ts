import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { RentalAppModule } from './rental-app.module';

async function bootstrap() {
  const app = await NestFactory.create(RentalAppModule);
  const configService = app.get(ConfigService);

  const port = process.env.PORT || process.argv[2] || 4003;

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // app.useLogger(app.get(Logger));

  const corsOrigin =
    configService.get<string>('CORS_ORIGIN') || 'http://localhost:5173';
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });
  await app.listen(port);
}
bootstrap();
