import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocalFilesController } from '@/controllers';
import { LocalFile } from '@/entities';
import { LocalFilesService } from '@/services';

@Module({
  imports: [TypeOrmModule.forFeature([LocalFile])],
  providers: [LocalFilesService],
  controllers: [LocalFilesController],
  exports: [LocalFilesService],
})
export class LocalFilesModule {}
