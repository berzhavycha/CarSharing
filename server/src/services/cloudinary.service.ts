import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

import { CloudinaryResponse } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    const uploadToCloudinary = async () => {
      return new Promise<CloudinaryResponse>((resolve, reject) => {
        console.log("CLOUDINARY_FILE_DATA", file)
        const mime = file.mimetype;
        const encoding = 'base64';
        const base64Data = Buffer.from(file.buffer).toString('base64');
        const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;


        const uploadStream = cloudinary.uploader.upload(fileUri).then((result) => {
          console.log(result);
          resolve(result);
        })
          .catch((error) => {
            console.log(error);
            reject(error);
          });

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    }

    return await uploadToCloudinary()
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
