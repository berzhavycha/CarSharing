import { Module } from '@nestjs/common';
import { ConfigModule as OriginalConfigModule } from '@nestjs/config';

import { configValidationSchema } from './validation';

@Module({
  imports: [
    OriginalConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      validationSchema: configValidationSchema,
    }),
  ],
})
export class ConfigModule {}
