import { Rental } from '@entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Rental])],
})
export class RentalsModule {}
