import { defaultFileFilter, defaultFileLimits, Roles } from '@app/shared';
import { RoleGuard } from '@app/shared/guards/roles.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UpdateUserBalanceDto, UpdateUserDto } from '../dtos';
import { User } from '../entities';
import { UserService } from '../services';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Patch(':id')
  @UseGuards(RoleGuard([Roles.ADMIN, Roles.USER]))
  @UseInterceptors(
    FileInterceptor('picture', {
      fileFilter: defaultFileFilter,
      limits: defaultFileLimits,
    }),
  )
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto, file);
  }

  @Get(':id')
  async getUser(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Post(':id/top-up')
  @UseGuards(RoleGuard([Roles.USER]))
  async topUpUserAccount(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserBalanceDto: UpdateUserBalanceDto,
  ): Promise<{ message: string }> {
    await this.usersService.initiateUserTopUpSaga(id, updateUserBalanceDto);

    return { message: 'Top-up request submitted' };
  }
}
