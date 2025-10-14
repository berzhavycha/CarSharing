import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { File } from '../entities/file.entity';
import { FileService } from '../services/file.service';

import { FilesManagerModule } from './files-manager.module';

@Module({
  imports: [TypeOrmModule.forFeature([File]), FilesManagerModule],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
