import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Rental } from '@/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Rental])],
})
export class RentalsModule {}
