import {
    Body,
    Controller,
    Param,
    ParseUUIDPipe,
    Patch,
    UseGuards,
} from '@nestjs/common';

import { UpdateUserDto } from '@/dtos';
import { User } from '@/entities';
import { JwtAuthGuard } from '@/guards';
import { UsersService } from '@/services';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Patch(':id')
    updateUser(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<User> {
        return this.usersService.updateUser(id, updateUserDto)
    }
}
