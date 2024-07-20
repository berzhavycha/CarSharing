import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

import { FilesManagerService } from './files-manager.service';
import { UploadedFile } from '@/types';

@Injectable()
export class AwsFilesService extends FilesManagerService {
    private readonly s3: S3;
    private readonly bucketName: string;

    constructor(private readonly configService: ConfigService) {
        super();
        this.s3 = new S3();
        this.bucketName = this.configService.get<string>('AWS_PUBLIC_BUCKET_NAME');
    }

    async uploadPublicFile(file: Express.Multer.File): Promise<UploadedFile> {
        const uploadResult = await this.s3.upload({
            Bucket: this.bucketName,
            Body: file.buffer,
            Key: `${uuid()}-${file.originalname}`,
        }).promise();

        return {
            key: uploadResult.Key,
            url: uploadResult.Location,
            publicId: null,
        };
    }

    async removeFile(key: string): Promise<void> {
        await this.s3.deleteObject({
            Bucket: this.bucketName,
            Key: key,
        }).promise();
    }
}
