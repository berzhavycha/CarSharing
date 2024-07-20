import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse, UploadedFile } from '@/types';
import { FilesManagerService } from './files-manager.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryFilesService extends FilesManagerService {
    async uploadPublicFile(file: Express.Multer.File): Promise<UploadedFile> {
        const uploadedResult: CloudinaryResponse = await new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
                if (error) reject(error);
                resolve(result);
            });

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });

        return {
            url: uploadedResult.url,
            publicId: uploadedResult.public_id,
            key: null,
        };
    }

    async removeFile(publicId: string): Promise<void> {
        await new Promise<CloudinaryResponse>((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) reject(error);
                resolve(result);
            });
        });
    }
}
