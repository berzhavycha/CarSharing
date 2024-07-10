import { PublicFile } from '@/entities';
import { PublicFilesService } from '@/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([PublicFile])],
    providers: [PublicFilesService],
    exports: [PublicFilesService]
})
export class PublicFilesModule { }
