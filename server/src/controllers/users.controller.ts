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

import { UpdateUserBalanceDto, UpdateUserDto } from '@/dtos';
import { User } from '@/entities';
import { JwtAuthGuard, RoleGuard } from '@/guards';
import { Roles, TransactionType } from '@/helpers';
import { UsersService } from '@/services';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('picture'))
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() picture: Express.Multer.File,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto, picture);
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
