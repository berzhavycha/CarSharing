import { CloudinaryService } from '@/services/cloudinary.service';
import { Test, TestingModule } from '@nestjs/testing';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { makeFile } from '../utils';

jest.mock('cloudinary', () => ({
    v2: {
        uploader: {
            upload_stream: jest.fn(),
            destroy: jest.fn(),
        },
    },
}));

jest.mock('streamifier', () => ({
    createReadStream: jest.fn(),
}));

describe('CloudinaryService', () => {
    let service: CloudinaryService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CloudinaryService],
        }).compile();

        service = module.get<CloudinaryService>(CloudinaryService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('uploadFile', () => {
        it('should upload a file and return the response', async () => {
            const file = makeFile()
            const mockUploadStream = jest.fn();
            (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
                (cb) => {
                    mockUploadStream.mockImplementation((stream) => stream.end());
                    return mockUploadStream(cb(null, { url: 'http://example.com' }));
                },
            );

            (streamifier.createReadStream as jest.Mock).mockReturnValue({
                pipe: jest.fn(),
            });

            const result = await service.uploadFile(file);
            expect(result).toEqual({ url: 'http://example.com' });
            expect(mockUploadStream).toHaveBeenCalled();
        });

        it('should reject when upload fails', async () => {
            const file = { buffer: Buffer.from('test') } as Express.Multer.File;
            const mockUploadStream = jest.fn();
            (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
                (cb) => {
                    mockUploadStream.mockImplementation((stream) => stream.end());
                    return mockUploadStream(cb(new Error('Upload error'), null));
                },
            );

            (streamifier.createReadStream as jest.Mock).mockReturnValue({
                pipe: jest.fn(),
            });

            await expect(service.uploadFile(file)).rejects.toThrow('Upload error');
        });
    });

    describe('deleteFile', () => {
        it('should delete a file and return the response', async () => {
            const publicId = 'test-id';
            (cloudinary.uploader.destroy as jest.Mock).mockImplementation(
                (id, cb) => cb(null, { result: 'ok' }),
            );

            const result = await service.deleteFile(publicId);
            expect(result).toEqual({ result: 'ok' });
            expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
                publicId,
                expect.any(Function),
            );
        });

        it('should reject when delete fails', async () => {
            const publicId = 'test-id';
            (cloudinary.uploader.destroy as jest.Mock).mockImplementation(
                (id, cb) => cb(new Error('Delete error'), null),
            );

            await expect(service.deleteFile(publicId)).rejects.toThrow('Delete error');
        });
    });
});