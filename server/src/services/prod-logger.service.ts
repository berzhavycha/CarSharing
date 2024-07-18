import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import * as AWS from 'aws-sdk';
import WinstonCloudWatch from 'winston-cloudwatch';

@Injectable()
export class ProdLoggerService {
    private readonly logger: winston.Logger;

    constructor(private configService: ConfigService) {
        const awsRegion = this.configService.get<string>('AWS_REGION');
        const logGroupName = this.configService.get<string>('LOG_GROUP_NAME');
        const logStreamName = this.configService.get<string>('LOG_STREAM_NAME');

        console.log('AWS Region:', awsRegion);
        console.log('Log Group Name:', logGroupName);
        console.log('Log Stream Name:', logStreamName);

        AWS.config.update({ region: awsRegion });

        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            transports: [
                new WinstonCloudWatch({
                    logGroupName,
                    logStreamName,
                    awsRegion,
                    jsonMessage: true,
                }),
            ],
        });
    }

    log(message: string): void {
        console.log('message')
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
