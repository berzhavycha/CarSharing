import { Module } from '@nestjs/common';
import { DatabaseModule } from '@modules/database';
import { ConfigModule } from '@modules/config';

@Module({
  imports: [DatabaseModule, ConfigModule],
})
export class AppModule { }
