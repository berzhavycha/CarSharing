import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class LoggerService {
    abstract log(message: string): void;
    abstract error(message: string, trace?: string): void;
    abstract warn(message: string): void;
    abstract debug(message: string): void;
}
