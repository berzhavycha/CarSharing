import { RentCarDto } from "@/dtos";
import { Rental, User } from "@/entities";
import { CarStatus, rentalsErrorMessages, RentalStatus, TransactionType } from "@/helpers";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";
import { CarsService } from "./cars.service";
import { TransactionsService } from "./transactions.service";

@Injectable()
export class RentalsService {
    constructor(
        @InjectRepository(Rental)
        private rentalsRepository: Repository<Rental>,
        private carsService: CarsService,
        private transactionsService: TransactionsService,
        private entityManager: EntityManager
    ) { }

    async rentCar(rentCarDto: RentCarDto, user: User): Promise<Rental> {
        const existingActiveUserRental = await this.rentalsRepository.findOne({
            where: {
                user: { id: user.id },
                rentalEnd: null
            }
        });

        if (existingActiveUserRental) {
            throw new BadRequestException(rentalsErrorMessages.USER_HAVE_ACTIVE_RENTAL);
        }

        const car = await this.carsService.findOne(rentCarDto.carId);

        if (!car || car.status !== CarStatus.AVAILABLE) {
            throw new BadRequestException(rentalsErrorMessages.CAR_NOT_AVAILABLE);
        }

        const rentalCost = car.pricePerHour * rentCarDto.hours;
        if (user.balance < rentalCost) {
            throw new BadRequestException(rentalsErrorMessages.INSUFFICIENT_BALANCE);
        }

        return this.entityManager.transaction(async manager => {
            const rental = this.rentalsRepository.create({
                car,
                user,
                status: RentalStatus.ACTIVE,
                requestedHours: rentCarDto.hours
            });

            const createdRental = await manager.save(rental);

            user.balance -= rentalCost;
            await manager.save(user);

            await this.transactionsService.createTransaction({
                amount: -rentalCost,
                description: `Rental of car ${car.model}`,
                type: TransactionType.RENTAL_PAYMENT,
                user,
                rental: createdRental,
            }, manager);

            return createdRental;
        });
    }
}
