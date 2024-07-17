import { CloudinaryProvider } from '@/core';
import { CloudinaryService } from '@/services/cloudinary.service';
import { Module } from '@nestjs/common';

@Module({
    providers: [CloudinaryProvider, CloudinaryService],
    exports: [CloudinaryProvider, CloudinaryService]
})
export class CloudinaryModule { }