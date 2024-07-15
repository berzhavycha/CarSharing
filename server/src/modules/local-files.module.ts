import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocalFile } from '@/entities';
import { LocalFilesService } from '@/services';
import { LocalFilesController } from '@/controllers';

@Module({
    imports: [TypeOrmModule.forFeature([LocalFile])],
    controllers: [LocalFilesController],
    providers: [LocalFilesService],
    exports: [LocalFilesService],
})
export class LocalFilesModule { }
