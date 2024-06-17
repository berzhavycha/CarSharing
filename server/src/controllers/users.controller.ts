import {
    Body,
    Controller,
    Patch,
    UseGuards,
} from '@nestjs/common';

import { UpdateUserBalanceDto, UpdateUserDto } from '@/dtos';
import { User } from '@/entities';
import { JwtAuthGuard, RoleGuard } from '@/guards';
import { UsersService } from '@/services';
import { CurrentUser } from '@decorators';
import { Roles } from '@/helpers';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Patch()
    @UseGuards(JwtAuthGuard)
    async updateUser(
        @CurrentUser('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<User> {
        return this.usersService.updateUser(id, updateUserDto)
    }

    @Patch('top-up')
    @UseGuards(RoleGuard(Roles.USER))
    async topUpUserAccount(
        @CurrentUser('id') id: string,
        @Body() updateUserBalanceDto: UpdateUserBalanceDto
    ): Promise<User> {
        return this.usersService.updateUserBalance(id, updateUserBalanceDto)
    }
}
