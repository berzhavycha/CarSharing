import {
  BadRequestException,
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UpdateUserBalanceDto, UpdateUserDto } from '@/dtos';
import { User } from '@/entities';
import { JwtAuthGuard, RoleGuard } from '@/guards';
import { ONE_MB, Roles, TransactionType, localFilesErrors } from '@/helpers';
import { UsersService } from '@/services';
import { LocalFilesInterceptor } from '@/interceptors';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(LocalFilesInterceptor({
    fieldName: 'picture',
    path: '/avatars',
    fileFilter: (request, file, callback) => {
      if (!file.mimetype.includes('image')) {
        return callback(new BadRequestException(localFilesErrors.INVALID_IMAGE), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: ONE_MB
    }
  }))
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto, {
      path: file.path,
      filename: file.originalname,
      mimetype: file.mimetype
    });
  }

  @Patch(':id/top-up')
  @UseGuards(RoleGuard(Roles.USER))
  async topUpUserAccount(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserBalanceDto: UpdateUserBalanceDto,
  ): Promise<User> {
    return this.usersService.updateUserBalance({
      id,
      balanceDto: updateUserBalanceDto,
      transactionType: TransactionType.TOP_UP,
    });
  }
}
