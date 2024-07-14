import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UpdateUserBalanceDto, UpdateUserDto } from '@/dtos';
import { User } from '@/entities';
import { JwtAuthGuard, RoleGuard } from '@/guards';
import {
  defaultFileFilter,
  defaultFileLimits,
  Roles,
  TransactionType,
} from '@/helpers';
import { UsersService } from '@/services';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('picture', {
      fileFilter: defaultFileFilter,
      limits: defaultFileLimits,
    }),
  )
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<User> {
    const uploadedFile = file
      ? {
          imageBuffer: file?.buffer,
          filename: file?.originalname,
        }
      : null;

    return this.usersService.updateUser(id, updateUserDto, uploadedFile);
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
