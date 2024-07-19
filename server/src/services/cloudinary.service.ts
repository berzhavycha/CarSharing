import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from '@/types';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    console.log("CLOUDINARY FILE DATA", file);

    const base64String = file.buffer.toString('base64');
    const dataUri = `data:${file.mimetype};base64,${base64String}`;

    try {
      const result = await cloudinary.uploader.upload(dataUri, { timeout: 60000 });
      return result;
    } catch (error) {
      console.error('Failed to upload file to Cloudinary:', error);
      throw new Error(`Failed to upload file to Cloudinary: ${error.message || 'Unknown error'}`);
    }
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
