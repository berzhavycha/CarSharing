import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { File } from '../entities/file.entity';
import { filesErrors } from '../helpers/errors';

import { FilesManagerService } from './files-manager.service';

// import { LoggerService } from './logger.service';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private publicFilesRepository: Repository<File>,
    private readonly filesService: FilesManagerService,
    // private readonly loggerService: LoggerService,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<File> {
    try {
      const uploadResult = await this.filesService.uploadFile(file);

      const newFile = this.publicFilesRepository.create({
        ...uploadResult,
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
      });
      return this.publicFilesRepository.save(newFile);
    } catch (error) {
      // this.loggerService.error(
      //   `Error uploading public file: ${error.message}`,
      //   error.stack,
      // );
      console.log(error);
      throw error;
    }
  }

  async uploadLocalFile(file: Express.Multer.File): Promise<File> {
    try {
      const newFile = this.publicFilesRepository.create({
        path: file.path,
        mimetype: file.mimetype,
        filename: file.filename,
      });
      return this.publicFilesRepository.save(newFile);
    } catch (error) {
      // this.loggerService.error(
      //   `Error uploading public file: ${error.message}`,
      //   error.stack,
      // );
      console.log(error);
      throw error;
    }
  }

  async findById(id: string): Promise<File> {
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
      // this.loggerService.error(
      //   `Error removing public file: ${error.message}`,
      //   error.stack,
      // );
      console.log(error);
      throw error;
    }
  }
}
