
import { LocalFileDto } from '@/dtos';
import { LocalFile } from '@/entities/local-file.entity';
import { localFilesErrors } from '@/helpers';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LocalFilesService {
    constructor(
        @InjectRepository(LocalFile)
        private localFilesRepository: Repository<LocalFile>,
    ) { }

    async saveLocalFileData(fileData: LocalFileDto): Promise<LocalFile> {
        const newFile = this.localFilesRepository.create(fileData)
        return this.localFilesRepository.save(newFile);
    }

    async getFileById(id: string): Promise<LocalFile> {
        const file = await this.localFilesRepository.findOne({ where: { id } });
        if (!file) {
            throw new NotFoundException(localFilesErrors.NOT_FOUND);
        }
        return file;
    }
}