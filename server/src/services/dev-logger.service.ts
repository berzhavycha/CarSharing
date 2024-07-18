import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { NODE_ENV } from '@/helpers';

const logDirectory = path.join(process.cwd(), 'src/core/logs');

@Injectable()
export class DevLoggerService {
  private readonly logger: winston.Logger | null;

  constructor() {
    this.logger =
      process.env.NODE_ENV === NODE_ENV.production
        ? null
        : winston.createLogger({
            level: 'debug',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.json(),
            ),
            transports: [
              new DailyRotateFile({
                filename: path.join(logDirectory, 'application-%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
              }),
            ],
          });
  }

  log(message: string): void {
    if (this.logger) {
      this.logger.info(message);
    }
  }

  error(message: string, trace?: string): void {
    if (this.logger) {
      this.logger.error(message, { trace });
    }
  }

  warn(message: string): void {
    if (this.logger) {
      this.logger.warn(message);
    }
  }

  debug(message: string): void {
    if (this.logger) {
      this.logger.debug(message);
    }
  }
}
