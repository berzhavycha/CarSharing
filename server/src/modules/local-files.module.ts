import { LocalFilesController } from '@/controllers';
import { LocalFile } from '@/entities';
import { LocalFilesService } from '@/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([LocalFile])],
    providers: [LocalFilesService],
    controllers: [LocalFilesController],
    exports: [LocalFilesService]
})
export class LocalFilesModule { }
