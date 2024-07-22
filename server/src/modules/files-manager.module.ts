import { Module } from '@nestjs/common';

import { CloudinaryProvider, FilesManagerProvider } from '@/core';
import { FilesManagerService } from '@/services';

@Module({
  providers: [CloudinaryProvider, FilesManagerProvider],
  exports: [CloudinaryProvider, FilesManagerService],
})
export class FilesManagerModule {}
