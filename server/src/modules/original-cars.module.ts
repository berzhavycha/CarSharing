import { OriginalCar } from '@entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OriginalCar])],
})
export class OriginalCarsModule {}
