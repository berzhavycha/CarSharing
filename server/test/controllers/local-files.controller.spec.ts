import { Test, TestingModule } from '@nestjs/testing';
import { LocalFilesController } from '@/controllers';
import { LocalFilesService } from '@/services';
import { Response } from 'express-serve-static-core';
import { StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { mockLocalFilesService } from '../mocks';

jest.mock('fs');
jest.mock('path');

describe('LocalFilesController', () => {
    let controller: LocalFilesController;
    let service: LocalFilesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LocalFilesController],
            providers: [
                {
                    provide: LocalFilesService,
                    useValue: mockLocalFilesService
                },
            ],
        }).compile();

        controller = module.get<LocalFilesController>(LocalFilesController);
        service = module.get<LocalFilesService>(LocalFilesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getDatabaseFileById', () => {
        it('should retrieve and stream file correctly', async () => {
            const mockFileId = 'mock-file-id';
            const mockFile = {
                path: '/mock/path/to/file',
                filename: 'mockfile.txt',
                mimetype: 'text/plain',
            };

            (service.findById as jest.Mock).mockResolvedValue(mockFile);

            const mockResponse = {
                setHeader: jest.fn(),
                send: jest.fn(),
            } as unknown as Response;

            const mockStream = {} as unknown as NodeJS.ReadableStream;
            (createReadStream as jest.Mock).mockReturnValue(mockStream);

            const result = await controller.getDatabaseFileById(mockFileId, mockResponse);

            expect(service.findById).toHaveBeenCalledWith(mockFileId);

            expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Disposition', `inline; filename="${mockFile.filename}"`);
            expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', mockFile.mimetype);

            expect(createReadStream).toHaveBeenCalledWith(join(process.cwd(), mockFile.path));

            expect(result).toBeInstanceOf(StreamableFile);
        });
    });
});
