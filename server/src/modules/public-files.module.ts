import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PublicFile } from '@/entities';
import { PublicFilesService } from '@/services';
import { FilesManagerModule } from './files-manager.module';

@Module({
  imports: [TypeOrmModule.forFeature([PublicFile]), FilesManagerModule],
  providers: [PublicFilesService],
  exports: [PublicFilesService],
})
export class PublicFilesModule { }
