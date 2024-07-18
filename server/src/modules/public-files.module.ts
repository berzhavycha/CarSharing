import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PublicFile } from '@/entities';
import { PublicFilesService } from '@/services';

import { CloudinaryModule } from './cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([PublicFile]), CloudinaryModule],
  providers: [PublicFilesService],
  exports: [PublicFilesService],
})
export class PublicFilesModule {}
