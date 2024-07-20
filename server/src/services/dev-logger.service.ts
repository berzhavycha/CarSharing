import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { LoggerService } from './logger.service';

const logDirectory = path.join(process.cwd(), 'src/core/logs');

@Injectable()
export class DevLoggerService extends LoggerService {
  private readonly logger: winston.Logger | null;

  constructor() {
    super()
    this.logger = winston.createLogger({
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
