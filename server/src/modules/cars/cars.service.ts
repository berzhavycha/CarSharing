import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities';
import { CreateCarDto, UpdateCarDto } from './dtos';
import { errorMessages } from './constants';

@Injectable()
export class CarsService {
    constructor(
        @InjectRepository(Car)
        private carsRepository: Repository<Car>,
    ) { }

    async createCar(createCarDto: CreateCarDto): Promise<Car> {
        const car = this.carsRepository.create(createCarDto);
        return this.carsRepository.save(car);
    }

    async updateCar(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
        const car = await this.carsRepository.preload({
            id: id,
            ...updateCarDto,
        });

        if (!car) {
            throw new NotFoundException(errorMessages.CAR_BY_ID_NOT_FOUND(id));
        }

        return this.carsRepository.save(car);
    }
}
