import { LocalFilesService } from '@/services';
import {
    Controller,
    Get,
    Param,
    StreamableFile,
    Res,
    ParseUUIDPipe,
} from '@nestjs/common';
import { Response } from 'express-serve-static-core';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('local-files')
export class LocalFilesController {
    constructor(
        private readonly localFilesService: LocalFilesService
    ) { }

    @Get(':id')
    async getDatabaseFileById(@Param('id', ParseUUIDPipe) id: string, @Res({ passthrough: true }) response: Response): Promise<StreamableFile> {
        const file = await this.localFilesService.getFileById(id);

        const stream = createReadStream(join(process.cwd(), file.path));

        response.set({
            'Content-Disposition': `inline; filename="${file.filename}"`,
            'Content-Type': file.mimetype
        })
        return new StreamableFile(stream);
    }
}