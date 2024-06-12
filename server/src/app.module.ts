import { Module } from '@nestjs/common';
import { DatabaseModule } from '@modules/database';
import { ConfigModule } from '@modules/config';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [DatabaseModule, ConfigModule, UsersModule],
})
export class AppModule { }
