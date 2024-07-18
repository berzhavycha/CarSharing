import { Injectable } from '@nestjs/common';

@Injectable()
export class ProdLoggerService {
  constructor() {}

  private formatMessage(
    level: string,
    message: string,
    trace?: string,
  ): string {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    if (trace) {
      return `${formattedMessage}\nTrace: ${trace}`;
    }
    return formattedMessage;
  }

  log(message: string): void {
    console.log(this.formatMessage('info', message));
  }

  error(message: string, trace?: string): void {
    console.error(this.formatMessage('error', message, trace));
  }

  warn(message: string): void {
    console.warn(this.formatMessage('warn', message));
  }

  debug(message: string): void {
    console.debug(this.formatMessage('debug', message));
  }
}
