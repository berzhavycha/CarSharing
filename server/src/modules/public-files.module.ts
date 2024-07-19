import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PublicFile } from '@/entities';
import { PublicFilesService } from '@/services';

@Module({
  imports: [TypeOrmModule.forFeature([PublicFile])],
  providers: [PublicFilesService],
  exports: [PublicFilesService],
})
export class PublicFilesModule { }
