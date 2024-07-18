import { Global, Module } from '@nestjs/common';

import { loggerProvider } from '@/core';
import { LoggerService } from '@/services';

@Global()
@Module({
  providers: [loggerProvider],
  exports: [LoggerService],
})
export class LoggerModule {}
