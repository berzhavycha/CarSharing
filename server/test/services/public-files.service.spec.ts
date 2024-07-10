import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import AWSMock from 'aws-sdk-mock';

import { PublicFile } from '@/entities';
import { PublicFilesService } from '@/services';

import { testRepository } from '../test-objects';
import { makePublicFile } from '../utils';
import { ConfigService } from '@nestjs/config';

describe('PublicFilesService', () => {
  let publicFilesRepository: Repository<PublicFile>;
  let publicFilesService: PublicFilesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PublicFilesService,
        {
          provide: getRepositoryToken(PublicFile),
          useValue: testRepository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-bucket-name'),
          },
        },
      ],
    }).compile();

    publicFilesService = module.get<PublicFilesService>(PublicFilesService);
    publicFilesRepository = module.get<Repository<PublicFile>>(
      getRepositoryToken(PublicFile),
    );

    AWSMock.mock('S3', 'upload', (params, callback) => {
      callback(null, { Key: 'key', Location: 'url' });
    });

    AWSMock.mock('S3', 'deleteObject', (params, callback) => {
      callback(null, {});
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    AWSMock.restore('S3');
  });

  it('should be defined', () => {
    expect(publicFilesService).toBeDefined();
  });

  describe('uploadPublicFile', () => {
    it('should create a local file', async () => {
      const publicFile = makePublicFile();

      jest.spyOn(publicFilesRepository, 'create').mockReturnValue(publicFile);
      jest.spyOn(publicFilesRepository, 'save').mockResolvedValue(publicFile);

      const result = await publicFilesService.uploadPublicFile(
        Buffer.from('file'),
        'filename',
      );

      expect(result).toBe(publicFile);
      expect(publicFilesRepository.save).toHaveBeenCalledWith(publicFile);
    });
  });

  describe('findById', () => {
    it('should return a local file when found', async () => {
      const publicFile = makePublicFile();

      jest.spyOn(publicFilesRepository, 'findOne').mockResolvedValue(publicFile);

      const result = await publicFilesService.findById(publicFile.id);

      expect(result).toEqual(publicFile);
    });

    it('should throw NotFoundException when local file is not found', async () => {
      const nonExistingId = 'non-existing-id';

      jest.spyOn(publicFilesRepository, 'findOne').mockResolvedValue(null);

      await expect(publicFilesService.findById(nonExistingId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeFile', () => {
    it('should remove a file', async () => {
      const publicFile = makePublicFile();

      jest.spyOn(publicFilesService, 'findById').mockResolvedValue(publicFile);
      jest.spyOn(publicFilesRepository, 'remove').mockResolvedValue(null);

      await publicFilesService.removeFile(publicFile.id);

      expect(publicFilesService.findById).toHaveBeenCalledWith(publicFile.id);
      expect(publicFilesRepository.remove).toHaveBeenCalledWith(publicFile);
    });
  });
});
