import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OriginalCar } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([OriginalCar])],
})
export class OriginalCarsModule {}
