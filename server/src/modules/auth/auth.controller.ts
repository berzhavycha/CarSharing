import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dtos';
import { Response } from 'express-serve-static-core';
import { User } from '@modules/users';
import { plainToClass } from 'class-transformer';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('sign-up')
    async signUp(
        @Body() userDto: UserDto,
        @Res() res: Response,
    ): Promise<void> {
        const { user, tokens } = await this.authService.signUp(userDto);
        this.authService.setCookies(res, tokens);

        const transformedUser = plainToClass(User, user);
        res.status(HttpStatus.CREATED).json(transformedUser);
    }
}
