import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import * as AWS from 'aws-sdk';
import WinstonCloudWatch from 'winston-cloudwatch';

@Injectable()
export class ProdLoggerService {
    private readonly logger: winston.Logger;

    constructor() {
        AWS.config.update({ region: process.env.AWS_REGION });

        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            transports: [
                new WinstonCloudWatch({
                    logGroupName: process.env.LOG_GROUP_NAME,
                    logStreamName: process.env.LOG_STREAM_NAME,
                    awsRegion: process.env.AWS_REGION,
                    jsonMessage: true,
                }),
            ],
        });
    }

    log(message: string): void {
        this.logger.info(message);
    }

    error(message: string, trace?: string): void {
        this.logger.error(message, { trace });
    }

    warn(message: string): void {
        this.logger.warn(message);
    }

    debug(message: string): void {
        this.logger.debug(message);
    }
}
