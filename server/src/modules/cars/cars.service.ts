import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities';
import { CreateCarDto, UpdateCarDto } from './dtos';
import { errorMessages } from './constants';
import { RentalStatus } from '@modules/rentals';

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

    async removeCar(id: string): Promise<void> {
        const car = await this.carsRepository.findOne({ where: { id }, relations: ['rentals'] })

        if (!car) {
            throw new NotFoundException(errorMessages.CAR_BY_ID_NOT_FOUND(id));
        }

        if (car.rentals.some(rental => rental.status === RentalStatus.ACTIVE)) {
            throw new BadRequestException(errorMessages.CAR_CANNOT_BE_DELETED)
        }

        await this.carsRepository.remove(car);
    }

    async findOne(id: string): Promise<Car> {
        const car = await this.carsRepository.findOne({ where: { id } });

        if (!car) {
            throw new NotFoundException(errorMessages.CAR_BY_ID_NOT_FOUND(id));
        }

        return car;
    }
}
