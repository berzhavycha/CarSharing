import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LocalFile } from '@/entities';
import { LocalFilesService } from '@/services';

import { testRepository } from '../test-objects';
import { makeLocalFile } from '../utils';

describe('LocalFilesService', () => {
  let localFilesRepository: Repository<LocalFile>;
  let localFilesService: LocalFilesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LocalFilesService,
        {
          provide: getRepositoryToken(LocalFile),
          useValue: testRepository,
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

      const localFile = makeLocalFile()

      jest.spyOn(localFilesRepository, 'create').mockReturnValue(localFile);
      jest.spyOn(localFilesRepository, 'save').mockResolvedValue(localFile);

      const result = await localFilesService.saveLocalFileData(localFileDto);

      expect(result).toBe(localFile);
      expect(localFilesRepository.save).toHaveBeenCalledWith(localFile);
    });
  });

  describe('findById', () => {
    it('should return a local file when found', async () => {
      const localFile = makeLocalFile()

      jest
        .spyOn(localFilesRepository, 'findOne')
        .mockResolvedValue(localFile);

      const result = await localFilesService.findById(localFile.id);

      expect(result).toEqual(localFile);
    });

    it('should throw NotFoundException when local file is not found', async () => {
      const nonExistingId = 'non-existing-id';

      jest.spyOn(localFilesRepository, 'findOne').mockResolvedValue(null);

      await expect(localFilesService.findById(nonExistingId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
