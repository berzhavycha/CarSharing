import { PublicFile } from '@/entities';
import { filesErrors } from '@/helpers';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PublicFilesService {
    constructor(
        @InjectRepository(PublicFile)
        private publicFilesRepository: Repository<PublicFile>,
        private readonly configService: ConfigService,
    ) { }

    async uploadPublicFile(dataBuffer: Buffer, filename: string): Promise<PublicFile> {
        const s3 = new S3();
        const uploadResult = await s3.upload({
            Bucket: this.configService.get<string>('AWS_PUBLIC_BUCKET_NAME'),
            Body: dataBuffer,
            Key: `${uuid()}-${filename}`
        })
            .promise();

        const newFile = this.publicFilesRepository.create({
            key: uploadResult.Key,
            url: uploadResult.Location
        });
        await this.publicFilesRepository.save(newFile);
        return newFile;
    }

    async findById(id: string): Promise<PublicFile> {
        const file = await this.publicFilesRepository.findOne({ where: { id } });
        if (!file) {
            throw new NotFoundException(filesErrors.NOT_FOUND);
        }
        return file;
    }

    async removeFile(id: string): Promise<void> {
        const file = await this.findById(id);
        
        const s3 = new S3();
        await s3.deleteObject({
            Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
            Key: file.key,
        }).promise();

        await this.publicFilesRepository.remove(file);
    }
}