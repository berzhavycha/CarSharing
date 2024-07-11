import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';

import express from 'express';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import cors from 'cors';

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
        const allowedOrigin = configService.get<string>('CORS_ORIGIN');

        // CORS setup
        expressApp.use(cors({
            origin: allowedOrigin,
            credentials: true,
        }));

        nestApp.useGlobalPipes(new ValidationPipe());
        nestApp.useGlobalPipes(new ValidationPipe({ transform: true }));
        nestApp.use(cookieParser());
        nestApp.useGlobalInterceptors(new ClassSerializerInterceptor(nestApp.get(Reflector)));
        nestApp.use(eventContext());

        await nestApp.init();
        cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
    }
    return cachedServer;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler: Handler = async (event: any, context: Context) => {
    cachedServer = await bootstrapServer();
    return proxy(cachedServer, event, context, 'PROMISE').promise;
};