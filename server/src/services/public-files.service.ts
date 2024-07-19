import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PublicFile } from '@/entities';
import { filesErrors } from '@/helpers';

import { CloudinaryService } from './cloudinary.service';
import { LoggerService } from './logger.service';

@Injectable()
export class PublicFilesService {
  constructor(
    @InjectRepository(PublicFile)
    private publicFilesRepository: Repository<PublicFile>,
    private readonly loggerService: LoggerService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async uploadPublicFile(file: Express.Multer.File): Promise<PublicFile> {
    try {
      // const uploadResult = await this.cloudinaryService.uploadFile(file);

      const newFile = this.publicFilesRepository.create({
        publicId: 'public_id',
        url: 'uploadResult.url',
      });
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
    try {
      const file = await this.publicFilesRepository.findOne({ where: { id } });
      if (!file) {
        throw new NotFoundException(filesErrors.NOT_FOUND);
      }
      return file;
    } catch (error) {
      this.loggerService.error(
        `Error finding public file by id: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async removeFile(id: string): Promise<void> {
    try {
      const file = await this.findById(id);

      await this.cloudinaryService.deleteFile(file.publicId);

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
