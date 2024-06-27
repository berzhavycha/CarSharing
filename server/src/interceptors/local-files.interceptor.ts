import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { Observable } from 'rxjs';

interface LocalFilesInterceptorOptions {
  fieldName: string;
  maxCount?: number;
  path?: string;
  fileFilter?: MulterOptions['fileFilter'];
  limits?: MulterOptions['limits'];
}

export function LocalFilesInterceptor(
  options: LocalFilesInterceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    filesInterceptor: NestInterceptor;

    constructor(private readonly configService: ConfigService) {
      const filesDestination = this.configService.get('UPLOADED_FILES_DESTINATION');
      const destination = options.path ? `${filesDestination}${options.path}` : filesDestination;

      const multerOptions = {
        storage: diskStorage({
          destination,
        }),
        fileFilter: options.fileFilter,
        limits: options.limits,
      };

      if (options.maxCount && options.maxCount > 1) {
        this.filesInterceptor = new (FilesInterceptor(
          options.fieldName,
          options.maxCount,
          multerOptions,
        ))();
      } else {
        this.filesInterceptor = new (FileInterceptor(
          options.fieldName,
          multerOptions,
        ))();
      }
    }

    intercept(
      ...args: Parameters<NestInterceptor['intercept']>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Observable<any> | Promise<Observable<any>> {
      return this.filesInterceptor.intercept(...args);
    }
  }

  return mixin(Interceptor);
}
