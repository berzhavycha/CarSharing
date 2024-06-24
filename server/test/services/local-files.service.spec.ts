import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LocalFile } from '@/entities';
import { LocalFilesService } from '@/services';

import { mockLocalFile, repositoryMock } from '../mocks';

describe('LocalFilesService', () => {
  let localFilesRepository: Repository<LocalFile>;
  let localFilesService: LocalFilesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LocalFilesService,
        {
          provide: getRepositoryToken(LocalFile),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    localFilesService = module.get<LocalFilesService>(LocalFilesService);
    localFilesRepository = module.get<Repository<LocalFile>>(
      getRepositoryToken(LocalFile),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(localFilesRepository).toBeDefined();
  });

  describe('saveLocalFileData', () => {
    it('should create a local file', async () => {
      const localFileDto = {
        filename: 'filename',
        path: 'some/path',
        mimetype: 'mimetype',
      };
      jest.spyOn(localFilesRepository, 'create').mockReturnValue(mockLocalFile);
      jest.spyOn(localFilesRepository, 'save').mockResolvedValue(mockLocalFile);

      const result = await localFilesService.saveLocalFileData(localFileDto);

      expect(result).toBe(mockLocalFile);
      expect(localFilesRepository.create).toHaveBeenCalledWith({
        ...localFileDto,
      });
      expect(localFilesRepository.save).toHaveBeenCalledWith(mockLocalFile);
    });
  });

  describe('findById', () => {
    it('should return a local file when found', async () => {
      jest
        .spyOn(localFilesRepository, 'findOne')
        .mockResolvedValue(mockLocalFile);

      const result = await localFilesService.findById(mockLocalFile.id);

      expect(result).toEqual(mockLocalFile);
      expect(localFilesRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockLocalFile.id },
      });
    });

    it('should throw NotFoundException when local file is not found', async () => {
      const nonExistingId = 'non-existing-id';

      jest.spyOn(localFilesRepository, 'findOne').mockResolvedValue(null);

      await expect(localFilesService.findById(nonExistingId)).rejects.toThrow(
        NotFoundException,
      );

      expect(localFilesRepository.findOne).toHaveBeenCalledWith({
        where: { id: nonExistingId },
      });
    });
  });
});
