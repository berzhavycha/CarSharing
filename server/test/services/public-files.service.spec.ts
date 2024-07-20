import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import AWSMock from 'aws-sdk-mock';
import { Repository } from 'typeorm';

import { PublicFile } from '@/entities';
import { LoggerService, PublicFilesService } from '@/services';

import { testLoggerService, testRepository } from '../test-objects';
import { makeFile, makePublicFile } from '../utils';

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
        { provide: LoggerService, useValue: testLoggerService },
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
    it('should create a file', async () => {
      const publicFile = makePublicFile();

      jest.spyOn(publicFilesRepository, 'create').mockReturnValue(publicFile);
      jest.spyOn(publicFilesRepository, 'save').mockResolvedValue(publicFile);

      const file = makeFile()
      const result = await publicFilesService.uploadPublicFile(file);

      expect(result).toBe(publicFile);
      expect(publicFilesRepository.save).toHaveBeenCalledWith(publicFile);
    });
  });

  describe('findById', () => {
    it('should return a file when found', async () => {
      const publicFile = makePublicFile();

      jest
        .spyOn(publicFilesRepository, 'findOne')
        .mockResolvedValue(publicFile);

      const result = await publicFilesService.findById(publicFile.id);

      expect(result).toEqual(publicFile);
    });

    it('should throw NotFoundException when file is not found', async () => {
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