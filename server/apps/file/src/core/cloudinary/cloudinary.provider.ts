import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 as cloudinary, ConfigOptions } from 'cloudinary';

export const CloudinaryProvider = {
  imports: [ConfigModule],
  provide: 'CLOUDINARY',
  useFactory: (configService: ConfigService): ConfigOptions => {
    return cloudinary.config({
      cloud_name: configService.get<string>('CLOUDINARY_NAME') || 'dwp6ctr3m',
      api_key:
        configService.get<string>('CLOUDINARY_API_KEY') || '126921791955174',
      api_secret:
        configService.get<string>('CLOUDINARY_API_SECRET') ||
        '_89a6sYxVXuG8n_3MUjw4O6h04A',
    });
  },
  inject: [ConfigService],
};
