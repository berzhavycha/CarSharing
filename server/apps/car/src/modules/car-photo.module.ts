import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarPhoto } from '../entities';
import { CarPhotoService } from '../services/car-photo.service';

@Module({
  imports: [TypeOrmModule.forFeature([CarPhoto])],
  controllers: [],
  providers: [CarPhotoService],
  exports: [CarPhotoService],
})
export class CarPhotoModule {}
