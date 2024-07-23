import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Context, Handler } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import cookieParser from 'cookie-parser';
import express from 'express';
import { Server } from 'http';

import { AppModule } from './app.module';

const binaryMimeTypes: string[] = [];

let cachedServer: Server;

async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    const configService = nestApp.get(ConfigService);

    nestApp.enableCors({
      origin: configService.get<string>('CORS_ORIGIN'),
      credentials: true,
    });

    nestApp.useGlobalPipes(new ValidationPipe({ transform: true }));
    nestApp.use(cookieParser());
    nestApp.useGlobalInterceptors(
      new ClassSerializerInterceptor(nestApp.get(Reflector)),
    );
    nestApp.use(eventContext());

    await nestApp.init();
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
  }
  return cachedServer;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler: Handler = async (event: any, context: Context) => {
  cachedServer = await bootstrapServer();
  context.callbackWaitsForEmptyEventLoop = false
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
