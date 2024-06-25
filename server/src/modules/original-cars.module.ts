import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OriginalCar } from '@/entities';
import { OriginalCarsService } from '@/services';
import { LocalFilesModule } from './local-files.module';

@Module({
  imports: [LocalFilesModule, TypeOrmModule.forFeature([OriginalCar])],
  providers: [OriginalCarsService],
  exports: [OriginalCarsService],
})
export class OriginalCarsModule { }
