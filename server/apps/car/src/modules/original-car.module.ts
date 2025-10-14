import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OriginalCar } from '../entities';
import { OriginalCarService } from '../services/original-car.service';

@Module({
  imports: [TypeOrmModule.forFeature([OriginalCar])],
  providers: [OriginalCarService],
  exports: [OriginalCarService],
})
export class OriginalCarModule {}
