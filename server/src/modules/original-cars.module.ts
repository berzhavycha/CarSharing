import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OriginalCar } from '@/entities';
import { OriginalCarsService } from '@/services';

@Module({
  imports: [TypeOrmModule.forFeature([OriginalCar])],
  providers: [OriginalCarsService],
  exports: [OriginalCarsService],
})
export class OriginalCarsModule { }
