import { createMock } from '@golevelup/ts-jest';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { QueryCarsDto, UpdateCarDto } from '@/dtos';
import { Car, PublicFile } from '@/entities';
import {
  applySearchAndPagination,
  carErrorMessages,
  CarStatus,
  RentalStatus,
} from '@/helpers';
import { CarsService, PublicFilesService } from '@/services';

import {
  makeCar,
  makeCreateCarDto,
  makeFile,
  makePublicFile,
  makeRental,
} from '../utils';

jest.mock('../../src/helpers/utils/apply-search-and-pagination.ts', () => ({
  applySearchAndPagination: jest.fn(),
}));

describe('CarsService', () => {
  let carsService: CarsService;
  let carsRepository: Repository<Car>;
  let publicFilesService: PublicFilesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CarsService,
        {
          provide: getRepositoryToken(Car),
          useValue: createMock<Repository<Car>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    carsService = module.get<CarsService>(CarsService);
    carsRepository = module.get<Repository<Car>>(getRepositoryToken(Car));
    publicFilesService = module.get<PublicFilesService>(PublicFilesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(carsService).toBeDefined();
  });

  describe('createCar', () => {
    it('should create a car', async () => {
      const createdCar = makeCar();
      const dto = makeCreateCarDto();

      jest.spyOn(carsRepository, 'create').mockReturnValue(createdCar);
      jest.spyOn(carsRepository, 'save').mockResolvedValue(createdCar);

      const result = await carsService.createCar(dto, []);

      expect(result).toBe(createdCar);
      expect(carsRepository.save).toHaveBeenCalledWith(createdCar);
    });
  });

  describe('updateCar', () => {
    it('should update a car', async () => {
      const updateCarDto = {
        status: CarStatus.BOOKED,
      };

      const car = makeCar();
      const updatedCar = makeCar({
        ...updateCarDto,
      });

      jest.spyOn(carsService, 'findById').mockResolvedValue(updatedCar);
      jest.spyOn(carsRepository, 'save').mockResolvedValue(updatedCar);

      const result = await carsService.updateCar(car.id, updateCarDto, []);

      expect(result).toEqual(updatedCar);
      expect(carsRepository.save).toHaveBeenCalledWith(updatedCar);
    });

    it('should throw NotFoundException if car with given id is not found', async () => {
      const nonExistingId = 'non-existing-id';

      jest
        .spyOn(carsService, 'findById')
        .mockImplementationOnce(() =>
          Promise.reject(
            new NotFoundException(
              carErrorMessages.CAR_BY_ID_NOT_FOUND(nonExistingId),
            ),
          ),
        );

      await expect(
        carsService.updateCar(nonExistingId, {} as UpdateCarDto, []),
      ).rejects.toThrow(NotFoundException);
    });

    it('should delete images not included in existingImagesIds', async () => {
      const updateCarDtoMock = {
        existingImagesIds: ['existing-image-id-1'],
      };

      const car = makeCar({
        id: 'car-id',
        pictures: [
          { id: 'existing-image-id-1' } as PublicFile,
          { id: 'existing-image-id-2' } as PublicFile,
        ],
      });

      jest.spyOn(carsService, 'findById').mockResolvedValue(car);
      jest.spyOn(carsRepository, 'save').mockResolvedValue(car);
      jest.spyOn(publicFilesService, 'removeFile').mockResolvedValue();

      await carsService.updateCar(car.id, updateCarDtoMock, []);

      expect(publicFilesService.removeFile).toHaveBeenCalledTimes(1);
      expect(publicFilesService.removeFile).toHaveBeenCalledWith(
        'existing-image-id-2',
      );
    });

    it('should add new images to the car', async () => {
      const publicFile = makePublicFile();
      const updateCarDtoMock = {
        existingImagesIds: [publicFile.id],
      };

      const newImages = [makeFile()];

      const car = makeCar();
      const updateCar = { ...car, pictures: [publicFile] };

      jest.spyOn(carsService, 'findById').mockResolvedValue({ ...updateCar });
      jest.spyOn(carsRepository, 'save').mockResolvedValue({
        ...updateCar,
        pictures: [publicFile, publicFile],
      });
      jest
        .spyOn(publicFilesService, 'uploadPublicFile')
        .mockResolvedValue(publicFile);

      const result = await carsService.updateCar(
        updateCar.id,
        updateCarDtoMock,
        newImages,
      );

      expect(result.pictures).toHaveLength(updateCar.pictures.length + 1);
    });

    it('should update other fields except pictures and existingImagesIds', async () => {
      const updateCarDtoMock = {
        status: CarStatus.BOOKED,
        model: 'Updated Model',
        description: 'Updated Description',
        existingImagesIds: ['existing-image-id-1'],
      };

      const car = makeCar();
      const updatedCar = makeCar({
        ...updateCarDtoMock,
      });

      jest.spyOn(carsService, 'findById').mockResolvedValue(car);
      jest.spyOn(carsRepository, 'save').mockResolvedValue(updatedCar);

      const result = await carsService.updateCar(car.id, updateCarDtoMock, []);

      expect(result.status).toEqual(updateCarDtoMock.status);
      expect(result.model).toEqual(updateCarDtoMock.model);
      expect(result.description).toEqual(updateCarDtoMock.description);
      expect(result.pictures).toEqual(expect.arrayContaining(car.pictures));
      expect(result.pictures).not.toContain(
        expect.objectContaining({ id: 'existing-image-id-1' }),
      );
    });
  });

  describe('removeCar', () => {
    it('should remove a car when no active rentals exist', async () => {
      const rental = makeRental({
        status: RentalStatus.CLOSED,
      });
      const carWithNoActiveRentals = makeCar({
        status: CarStatus.AVAILABLE,
        rentals: [rental],
      });

      jest
        .spyOn(carsService, 'findById')
        .mockResolvedValue(carWithNoActiveRentals);
      jest.spyOn(carsRepository, 'remove').mockResolvedValue(undefined);

      await carsService.removeCar(carWithNoActiveRentals.id);

      expect(carsRepository.remove).toHaveBeenCalledWith(
        carWithNoActiveRentals,
      );
    });

    it('should throw BadRequestException when active rentals exist', async () => {
      const rental = makeRental({
        status: RentalStatus.ACTIVE,
      });
      const carWithActiveRental = makeCar({
        status: CarStatus.BOOKED,
        rentals: [rental],
      });
      const car = makeCar();

      jest
        .spyOn(carsService, 'findById')
        .mockResolvedValue(carWithActiveRental);

      jest.spyOn(carsRepository, 'remove').mockResolvedValue(undefined);

      await expect(carsService.removeCar(car.id)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when car is not found', async () => {
      const nonExistingId = 'non-existing-id';

      jest
        .spyOn(carsService, 'findById')
        .mockImplementationOnce(() =>
          Promise.reject(
            new NotFoundException(
              carErrorMessages.CAR_BY_ID_NOT_FOUND(nonExistingId),
            ),
          ),
        );

      await expect(carsService.removeCar(nonExistingId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findById', () => {
    it('should return a car when found', async () => {
      const car = makeCar();

      jest.spyOn(carsRepository, 'findOne').mockResolvedValue(car);

      const result = await carsService.findById(car.id);

      expect(result).toEqual(car);
    });

    it('should throw NotFoundException when car is not found', async () => {
      const nonExistingId = 'non-existing-id';

      jest.spyOn(carsRepository, 'findOne').mockResolvedValue(null);

      await expect(carsService.findById(nonExistingId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all cars with pagination and search applied', async () => {
      const listCarsDto: QueryCarsDto = {
        search: 'query',
        page: 1,
        limit: 10,
        order: 'ASC',
        sort: 'model',
      };

      const car = makeCar();
      const queryBuilder = createMock<SelectQueryBuilder<Car>>();
      const resultValue: [Car[], number] = [
        [
          { ...car, id: '1' },
          { ...car, id: '2' },
        ],
        2,
      ];

      jest
        .spyOn(carsRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);
      jest.spyOn(queryBuilder, 'leftJoinAndSelect').mockReturnThis();
      jest
        .spyOn(queryBuilder, 'getManyAndCount')
        .mockResolvedValue(resultValue);

      const mockApplySearchAndPagination =
        applySearchAndPagination as jest.Mock;
      mockApplySearchAndPagination.mockImplementation((qb) => qb);

      const result = await carsService.findAll(listCarsDto);

      expect(result).toEqual(resultValue);
    });
  });
});
