import { Injectable } from '@nestjs/common';

@Injectable()
export class SingletonLoggerService {
    private static instance: SingletonLoggerService;

    private constructor() { }

    public static getInstance(): SingletonLoggerService {
        if (!SingletonLoggerService.instance) {
            SingletonLoggerService.instance = new SingletonLoggerService();
        }
        return SingletonLoggerService.instance;
    }

    log(message: string): void {
        console.info(message);
    }

    error(message: string, trace: string): void {
        console.error(`${message} - ${trace}`);
    }

    warn(message: string): void {
        console.warn(message);
    }

    debug(message: string): void {
        console.debug(message);
    }
}
