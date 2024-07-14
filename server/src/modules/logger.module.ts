import { LoggerService } from '@/services';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule { }
