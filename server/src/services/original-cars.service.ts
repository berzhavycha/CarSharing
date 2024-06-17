import { CreateOriginalCarDto, QueryCarsDto } from "@/dtos";
import { OriginalCar } from "@/entities";
import { DEFAULT_PAGINATION_PAGE, DEFAULT_PAGINATION_LIMIT, DEFAULT_ORDER, carErrorMessages, CAR_DEFAULT_ORDER_COLUMN, applySearchAndPagination } from "@/helpers";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class OriginalCarsService {
    constructor(
        @InjectRepository(OriginalCar)
        private originalCarsRepository: Repository<OriginalCar>,
    ) { }

    async createOriginalCar(createCarDto: CreateOriginalCarDto): Promise<OriginalCar> {
        const car = this.originalCarsRepository.create(createCarDto);
        return this.originalCarsRepository.save(car);
    }

    async findOne(id: string): Promise<OriginalCar> {
        const car = await this.originalCarsRepository.findOne({ where: { id } });

        if (!car) {
            throw new NotFoundException(carErrorMessages.CAR_BY_ID_NOT_FOUND(id));
        }

        return car;
    }

    async findAll(listCarsDto: QueryCarsDto): Promise<OriginalCar[]> {
        const {
            search,
            page = DEFAULT_PAGINATION_PAGE,
            limit = DEFAULT_PAGINATION_LIMIT,
            order = DEFAULT_ORDER,
            sort = CAR_DEFAULT_ORDER_COLUMN,
        } = listCarsDto;

        const queryBuilder = this.originalCarsRepository.createQueryBuilder('original_car');

        applySearchAndPagination(queryBuilder, {
            search,
            page,
            limit,
            order,
            sort,
            entityAlias: 'original_car',
        });

        return queryBuilder.getMany();
    }
}