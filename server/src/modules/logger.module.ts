import { Global, Module } from '@nestjs/common';

import { LoggerService } from '@/services';
import { loggerProvider } from '@/core';

@Global()
@Module({
  providers: [loggerProvider],
  exports: [LoggerService],
})
export class LoggerModule { }