import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { CreateCarDto, QueryCarsDto, UpdateCarDto } from '@/dtos';
import { Car } from '@/entities';
import {
  applySearchAndPagination,
  carErrorMessages,
  CarStatus,
  RentalStatus,
} from '@/helpers';
import { CarsService, LocalFilesService } from '@/services';

import {
  createCarDtoMock,
  mockCar,
  mockLocalFile,
  mockLocalFilesService,
  mockQueryBuilder,
  mockRental,
  repositoryMock,
} from '../mocks';

jest.mock('../../src/helpers/utils/apply-search-and-pagination.ts', () => ({
  applySearchAndPagination: jest.fn(),
}));

describe('CarsService', () => {
  let carsService: CarsService;
  let carsRepository: Repository<Car>;
  let localFilesService: LocalFilesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CarsService,
        {
          provide: getRepositoryToken(Car),
          useValue: repositoryMock,
        },
        {
          provide: LocalFilesService,
          useValue: mockLocalFilesService,
        },
      ],
    }).compile();

    carsService = module.get<CarsService>(CarsService);
    carsRepository = module.get<Repository<Car>>(getRepositoryToken(Car));
    localFilesService = module.get<LocalFilesService>(LocalFilesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(carsService).toBeDefined();
  });

  describe('createCar', () => {
    it('should create a car', async () => {
      const createdCar = {
        id: 'car-id',
        ...mockCar,
        ...createCarDtoMock,
      } as Car;

      jest.spyOn(carsRepository, 'create').mockReturnValue(createdCar);
      jest.spyOn(carsRepository, 'save').mockResolvedValue(createdCar);

      const result = await carsService.createCar(
        createCarDtoMock as CreateCarDto,
        [],
      );

      expect(result).toBe(createdCar);
      expect(carsRepository.create).toHaveBeenCalledWith(createCarDtoMock);
      expect(carsRepository.save).toHaveBeenCalledWith(createdCar);
    });
  });

  describe('updateCar', () => {
    it('should update a car', async () => {
      const updateCarDtoMock = {
        status: CarStatus.BOOKED,
      };

      const updatedCar = {
        ...mockCar,
        ...updateCarDtoMock,
      } as Car;

      jest.spyOn(carsService, 'findById').mockResolvedValue(mockCar);
      jest.spyOn(carsRepository, 'save').mockResolvedValue(updatedCar);

      const result = await carsService.updateCar(
        mockCar.id,
        updateCarDtoMock,
        [],
      );

      expect(result).toEqual(updatedCar);
      expect(carsService.findById).toHaveBeenCalledWith(mockCar.id);
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

      expect(carsService.findById).toHaveBeenCalledWith(nonExistingId);
      expect(carsRepository.save).not.toHaveBeenCalled();
    });

    it('should delete images not included in existingImagesIds', async () => {
      const updateCarDtoMock = {
        existingImagesIds: ['existing-image-id-1'],
      };

      const imagesToDelete = mockCar.pictures.filter(
        (picture) => !updateCarDtoMock.existingImagesIds.includes(picture.id),
      );

      jest.spyOn(carsService, 'findById').mockResolvedValue(mockCar);
      jest.spyOn(carsRepository, 'save').mockResolvedValue(mockCar);
      jest.spyOn(localFilesService, 'removeFile').mockResolvedValue();

      await carsService.updateCar(mockCar.id, updateCarDtoMock, []);

      expect(localFilesService.removeFile).toHaveBeenCalledTimes(
        imagesToDelete.length,
      );
    });

    it('should add new images to the car', async () => {
      const updateCarDtoMock = {
        existingImagesIds: [mockLocalFile.id],
      };

      const newImages = [
        {
          filename: 'new-image.jpg',
          mimetype: 'image/jpeg',
          path: '/path/to/new-image.jpg',
        },
      ];

      const updateCar = { ...mockCar, pictures: [mockLocalFile] };
      jest.spyOn(carsService, 'findById').mockResolvedValue({ ...updateCar });
      jest
        .spyOn(carsRepository, 'save')
        .mockResolvedValue({
          ...updateCar,
          pictures: [mockLocalFile, mockLocalFile],
        });
      jest
        .spyOn(localFilesService, 'saveLocalFileData')
        .mockResolvedValue(mockLocalFile);

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

      const updatedCar = {
        ...mockCar,
        ...updateCarDtoMock,
      } as Car;

      jest.spyOn(carsService, 'findById').mockResolvedValue(mockCar);
      jest.spyOn(carsRepository, 'save').mockResolvedValue(updatedCar);

      const result = await carsService.updateCar(
        mockCar.id,
        updateCarDtoMock,
        [],
      );

      expect(result.status).toEqual(updateCarDtoMock.status);
      expect(result.model).toEqual(updateCarDtoMock.model);
      expect(result.description).toEqual(updateCarDtoMock.description);
      expect(result.pictures).toEqual(expect.arrayContaining(mockCar.pictures));
      expect(result.pictures).not.toContain(
        expect.objectContaining({ id: 'existing-image-id-1' }),
      );
    });
  });

  describe('removeCar', () => {
    it('should remove a car when no active rentals exist', async () => {
      const carWithNoActiveRentals = {
        ...mockCar,
        status: CarStatus.AVAILABLE,
        rentals: [{ ...mockRental, status: RentalStatus.CLOSED }],
      };

      jest
        .spyOn(carsService, 'findById')
        .mockResolvedValue(carWithNoActiveRentals);
      jest.spyOn(carsRepository, 'remove').mockResolvedValue(undefined);

      await carsService.removeCar(carWithNoActiveRentals.id);

      expect(carsService.findById).toHaveBeenCalledWith(
        carWithNoActiveRentals.id,
      );
      expect(carsRepository.remove).toHaveBeenCalledWith(
        carWithNoActiveRentals,
      );
    });

    it('should throw BadRequestException when active rentals exist', async () => {
      const carWithActiveRental = {
        ...mockCar,
        rentals: [{ ...mockRental, status: RentalStatus.ACTIVE }],
      } as Car;

      jest
        .spyOn(carsService, 'findById')
        .mockResolvedValue(carWithActiveRental);

      jest.spyOn(carsRepository, 'remove').mockResolvedValue(undefined);

      await expect(carsService.removeCar(mockCar.id)).rejects.toThrow(
        BadRequestException,
      );

      expect(carsService.findById).toHaveBeenCalledWith(mockCar.id);
      expect(carsRepository.remove).not.toHaveBeenCalled();
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

      expect(carsService.findById).toHaveBeenCalledWith(nonExistingId);
      expect(carsRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a car when found', async () => {
      jest.spyOn(carsRepository, 'findOne').mockResolvedValue(mockCar);

      const result = await carsService.findById(mockCar.id);

      expect(result).toEqual(mockCar);
      expect(carsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCar.id },
        relations: ['rentals', 'pictures'],
      });
    });

    it('should throw NotFoundException when car is not found', async () => {
      const nonExistingId = 'non-existing-id';

      jest.spyOn(carsRepository, 'findOne').mockResolvedValue(null);

      await expect(carsService.findById(nonExistingId)).rejects.toThrow(
        NotFoundException,
      );

      expect(carsRepository.findOne).toHaveBeenCalledWith({
        where: { id: nonExistingId },
        relations: ['rentals', 'pictures'],
      });
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

      jest
        .spyOn(carsRepository, 'createQueryBuilder')
        .mockReturnValue(
          mockQueryBuilder as unknown as SelectQueryBuilder<Car>,
        );

      (applySearchAndPagination as jest.Mock).mockReturnValue(
        mockQueryBuilder as unknown as SelectQueryBuilder<Car>,
      );

      jest
        .spyOn(mockQueryBuilder, 'getManyAndCount')
        .mockResolvedValue([[mockCar], 0]);

      const result = await carsService.findAll(listCarsDto);

      expect(carsRepository.createQueryBuilder).toHaveBeenCalledWith('car');
      expect(applySearchAndPagination).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          search: listCarsDto.search,
          page: listCarsDto.page,
          limit: listCarsDto.limit,
          order: listCarsDto.order,
          sort: listCarsDto.sort,
          entityAlias: 'car',
        }),
      );
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
      expect(result).toEqual([[mockCar], 0]);
    });
  });

  describe('findAllAvailable', () => {
    it('should return all available cars with pagination and search applied', async () => {
      const listCarsDto: QueryCarsDto = {
        search: 'query',
        page: 1,
        limit: 10,
        order: 'ASC',
        sort: 'model',
      };

      jest
        .spyOn(carsRepository, 'createQueryBuilder')
        .mockReturnValue(
          mockQueryBuilder as unknown as SelectQueryBuilder<Car>,
        );

      (applySearchAndPagination as jest.Mock).mockReturnValue(mockQueryBuilder);

      jest
        .spyOn(mockQueryBuilder, 'getManyAndCount')
        .mockResolvedValue([[{ ...mockCar, status: CarStatus.AVAILABLE }], 1]);

      const result = await carsService.findAllAvailable(listCarsDto);

      expect(carsRepository.createQueryBuilder).toHaveBeenCalledWith('car');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'car.status = :status',
        {
          status: CarStatus.AVAILABLE,
        },
      );
      expect(applySearchAndPagination).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          search: listCarsDto.search,
          page: listCarsDto.page,
          limit: listCarsDto.limit,
          order: listCarsDto.order,
          sort: listCarsDto.sort,
          entityAlias: 'car',
        }),
      );
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
      expect(result).toEqual([
        [{ ...mockCar, status: CarStatus.AVAILABLE }],
        1,
      ]);
    });
  });
});
