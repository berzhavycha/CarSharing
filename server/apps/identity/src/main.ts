import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import cookieParser from 'cookie-parser';

import { IdentityAppModule } from './identity-app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(IdentityAppModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: configService.get('TCP_HOST'),
      port: configService.get('TCP_PORT'),
    },
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // app.useLogger(app.get(Logger));

  const corsOrigin =
    configService.get<string>('CORS_ORIGIN') || 'http://localhost:5173';
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });
  // loggerService.log(`CORS enabled with origin: ${corsOrigin}`);

  await app.startAllMicroservices();

  const port =
    process.env.PORT || process.argv[2] || configService.get('HTTP_PORT');

  await app.listen(port);

  console.log(
    configService.get('HTTP_PORT'),
    configService.get('TCP_HOST'),
    configService.get('TCP_PORT'),
  );
}
bootstrap();
