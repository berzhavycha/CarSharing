import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PublicFile } from '@/entities';
import {
  CloudinaryService,
  LoggerService,
  PublicFilesService,
} from '@/services';

import {
  testCloudinaryService,
  testLoggerService,
  testRepository,
} from '../test-objects';
import { makeCloudinaryFile, makeFile, makePublicFile } from '../utils';

describe('PublicFilesService', () => {
  let publicFilesRepository: Repository<PublicFile>;
  let publicFilesService: PublicFilesService;
  let cloudinaryService: CloudinaryService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PublicFilesService,
        {
          provide: getRepositoryToken(PublicFile),
          useValue: testRepository,
        },
        { provide: LoggerService, useValue: testLoggerService },
        { provide: CloudinaryService, useValue: testCloudinaryService },
      ],
    }).compile();

    publicFilesService = module.get<PublicFilesService>(PublicFilesService);
    publicFilesRepository = module.get<Repository<PublicFile>>(
      getRepositoryToken(PublicFile),
    );
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(publicFilesService).toBeDefined();
  });

  describe('uploadPublicFile', () => {
    it('should create a file', async () => {
      const publicFile = makePublicFile();
      const file = makeFile();
      const cloudinaryFile = makeCloudinaryFile();

      jest
        .spyOn(cloudinaryService, 'uploadFile')
        .mockResolvedValue(cloudinaryFile);
      jest.spyOn(publicFilesRepository, 'create').mockReturnValue(publicFile);
      jest.spyOn(publicFilesRepository, 'save').mockResolvedValue(publicFile);

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

      jest.spyOn(cloudinaryService, 'deleteFile').mockResolvedValue(undefined);
      jest.spyOn(publicFilesService, 'findById').mockResolvedValue(publicFile);
      jest.spyOn(publicFilesRepository, 'remove').mockResolvedValue(null);

      await publicFilesService.removeFile(publicFile.id);

      expect(publicFilesService.findById).toHaveBeenCalledWith(publicFile.id);
      expect(publicFilesRepository.remove).toHaveBeenCalledWith(publicFile);
    });
  });
});
