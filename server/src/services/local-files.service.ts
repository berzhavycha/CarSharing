import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LocalFileDto } from '@/dtos';
import { LocalFile } from '@/entities';
import { filesErrors } from '@/helpers/errors';
import { LoggerService } from './logger.service';

@Injectable()
export class LocalFilesService {
    constructor(
        @InjectRepository(LocalFile)
        private localFilesRepository: Repository<LocalFile>,
        private readonly loggerService: LoggerService,
    ) { }

    async saveLocalFileData(fileData: LocalFileDto): Promise<LocalFile> {
        try {
            const newFile = this.localFilesRepository.create(fileData);
            return this.localFilesRepository.save(newFile);
        } catch (error) {
            this.loggerService.error(
                `Error saving local file: ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }

    async findById(id: string): Promise<LocalFile> {
        const file = await this.localFilesRepository.findOne({ where: { id } });
        if (!file) {
            throw new NotFoundException(filesErrors.NOT_FOUND);
        }
        return file;
    }

    async removeFile(id: string): Promise<void> {
        try {
            const file = await this.findById(id);
            await this.localFilesRepository.remove(file);
        } catch (error) {
            this.loggerService.error(
                `Error removing local file: ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }
}