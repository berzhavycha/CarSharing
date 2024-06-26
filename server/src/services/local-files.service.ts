import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LocalFileDto } from '@/dtos';
import { LocalFile } from '@/entities';
import { localFilesErrors } from '@/helpers';

@Injectable()
export class LocalFilesService {
  constructor(
    @InjectRepository(LocalFile)
    private localFilesRepository: Repository<LocalFile>,
  ) {}

  async saveLocalFileData(fileData: LocalFileDto): Promise<LocalFile> {
    const newFile = this.localFilesRepository.create(fileData);
    return this.localFilesRepository.save(newFile);
  }

  async findById(id: string): Promise<LocalFile> {
    const file = await this.localFilesRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException(localFilesErrors.NOT_FOUND);
    }
    return file;
  }

  async removeFile(id: string): Promise<void> {
    const file = await this.findById(id);
    await this.localFilesRepository.remove(file);
  }
}
