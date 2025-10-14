import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { CarAppModule } from './car-app.module';

async function bootstrap() {
  const app = await NestFactory.create(CarAppModule);
  const configService = app.get(ConfigService);

  const port = process.env.PORT || process.argv[2] || 4002;

  app.use(cookieParser());
  const corsOrigin =
    configService.get<string>('CORS_ORIGIN') || 'http://localhost:5173';
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  await app.listen(port);
}
bootstrap();
