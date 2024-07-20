import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PublicFile } from '@/entities';
import { filesErrors } from '@/helpers';

import { FilesManagerService } from './files-manager.service';
import { LoggerService } from './logger.service';

@Injectable()
export class PublicFilesService {
  constructor(
    @InjectRepository(PublicFile)
    private publicFilesRepository: Repository<PublicFile>,
    private readonly filesService: FilesManagerService,
    private readonly loggerService: LoggerService,
  ) {}

  async uploadPublicFile(file: Express.Multer.File): Promise<PublicFile> {
    try {
      const uploadResult = await this.filesService.uploadPublicFile(file);

      const newFile = this.publicFilesRepository.create(uploadResult);
      return this.publicFilesRepository.save(newFile);
    } catch (error) {
      this.loggerService.error(
        `Error uploading public file: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findById(id: string): Promise<PublicFile> {
    const file = await this.publicFilesRepository.findOne({ where: { id } });

    if (!file) {
      throw new NotFoundException(filesErrors.NOT_FOUND);
    }

    return file;
  }

  async removeFile(id: string): Promise<void> {
    try {
      const file = await this.findById(id);

      await this.filesService.removeFile(file.key ?? file.publicId);
      await this.publicFilesRepository.remove(file);
    } catch (error) {
      this.loggerService.error(
        `Error removing public file: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
