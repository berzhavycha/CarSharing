import { Module } from '@nestjs/common';

import { EmailService } from '@/services';

@Module({
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
