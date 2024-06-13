import { Controller, Post, Body, Res, HttpStatus, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dtos';
import { Response } from 'express-serve-static-core';
import { User } from '@modules/users';
import { plainToClass } from 'class-transformer';
import { LocalAuthGuard } from './guards';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('sign-up')
    async signUp(
        @Body() userDto: RegisterUserDto,
        @Res() res: Response,
    ): Promise<void> {
        const { user, tokens } = await this.authService.signUp(userDto);
        this.authService.setCookies(res, tokens);

        const transformedUser = plainToClass(User, user);
        res.status(HttpStatus.CREATED).json(transformedUser);
    }

    @Post('sign-in')
    @UseGuards(LocalAuthGuard)
    async signIn(
        @Body() userDto: LoginUserDto,
        @Res() res: Response,
        @Request() req
    ): Promise<void> {
        const { user, tokens } = await this.authService.signIn(req.user);
        this.authService.setCookies(res, tokens);


        const transformedUser = plainToClass(User, user);
        res.status(HttpStatus.OK).json(transformedUser);
    }
}
