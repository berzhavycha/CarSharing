import { CorrelationManager } from '@app/shared';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [CorrelationManager],
  exports: [CorrelationManager],
})
export class CorrelationManagerModule {}
