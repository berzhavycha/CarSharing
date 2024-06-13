import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Car } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Car])],
})
export class CarsModule {}
