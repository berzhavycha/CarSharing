import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

import { CloudinaryResponse } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const streamifier = require('streamifier');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const https = require('https');

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    try {
      await new Promise((resolve, reject) => {
        https.get('https://api.cloudinary.com', (res) => {
          console.log('Cloudinary API reachable. Status:', res.statusCode);
          resolve(res);
        }).on('error', (e) => {
          console.error('Error reaching Cloudinary:', e);
          reject(e);
        });
      });
    } catch (error) {
      console.error('Connection test failed:', error);
    }

    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream)
        .on('error', (error) => {
          console.error('Stream error:', error);
          reject(error);
        });
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
