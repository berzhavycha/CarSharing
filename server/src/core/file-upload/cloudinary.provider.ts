import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 as cloudinary, ConfigOptions } from 'cloudinary';

export const CloudinaryProvider = {
  imports: [ConfigModule],
  provide: 'CLOUDINARY',
  useFactory: (configService: ConfigService): ConfigOptions => {
    return cloudinary.config({
      cloud_name: configService.get<string>('CLOUDINARY_NAME'),
      api_key: configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
      timeout: 50000,
    });
  },
  inject: [ConfigService],
};
