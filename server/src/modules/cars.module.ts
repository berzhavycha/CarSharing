import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarsController } from '@/controllers';
import { Car } from '@/entities';
import { CarsService } from '@/services';
import { LocalFilesModule } from './local-files.module';

@Module({
  imports: [LocalFilesModule, TypeOrmModule.forFeature([Car])],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule { }
