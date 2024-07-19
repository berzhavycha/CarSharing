import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from '@/types';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    console.log("CLOUDINARY FILE DATA", file);
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      cloudinary.uploader.upload(
        file.buffer.toString('base64'),
        {
          resource_type: 'auto',
          timeout: 60000, // Set timeout to 60 seconds (adjust as needed)
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  }

  deleteFile(publicId: string): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}