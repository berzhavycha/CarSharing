import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCarPhotoDto } from '../dtos/create-car-photo.dto';
import { CarPhoto } from '../entities';

@Injectable()
export class CarPhotoService {
  constructor(
    @InjectRepository(CarPhoto)
    private carPhotoRepository: Repository<CarPhoto>,
    // private readonly loggerService: LoggerService,
  ) {}

  async create(payload: CreateCarPhotoDto): Promise<CarPhoto> {
    try {
      const newFile = this.carPhotoRepository.create(payload);
      return this.carPhotoRepository.save(newFile);
    } catch (error) {
      //   this.loggerService.error(
      //     `Error uploading public file: ${error.message}`,
      //     error.stack,
      //   );
      console.log(error);
      throw error;
    }
  }

  async findById(id: string): Promise<CarPhoto> {
    const file = await this.carPhotoRepository.findOne({ where: { id } });
    return file;
  }

  async removeFile(id: string): Promise<void> {
    try {
      const file = await this.findById(id);
      await this.carPhotoRepository.remove(file);
    } catch (error) {
      //   this.loggerService.error(
      //     `Error removing public file: ${error.message}`,
      //     error.stack,
      //   );
      console.log(error);
      throw error;
    }
  }
}
