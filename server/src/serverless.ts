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

const binaryMimeTypes: string[] = [];

let cachedServer: Server;

async function bootstrapServer(): Promise<Server> {
    if (!cachedServer) {
        const expressApp = express();
        const nestApp = await NestFactory.create(
            AppModule,
            new ExpressAdapter(expressApp),
        );

        nestApp.useGlobalPipes(new ValidationPipe());
        nestApp.use(cookieParser());
        nestApp.useGlobalInterceptors(new ClassSerializerInterceptor(nestApp.get(Reflector)));
        nestApp.use(eventContext());

        const configService = nestApp.get(ConfigService);
        nestApp.enableCors({
            origin: configService.get<string>('CORS_ORIGIN'),
            credentials: true,
        });

        await nestApp.init();
        cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
    }
    return cachedServer;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler: Handler = async (event: any, context: Context) => {
    cachedServer = await bootstrapServer();

    const response = await proxy(cachedServer, event, context, 'PROMISE').promise;
    response.headers = {
        ...response.headers,
        'Access-Control-Allow-Origin': 'http://frontend-carsharing.s3-website.eu-north-1.amazonaws.com', 
        'Access-Control-Allow-Credentials': 'true',
    };
    return response;
};
