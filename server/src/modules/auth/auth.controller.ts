import { Controller, Post, Body, Res, HttpStatus, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dtos';
import { Response, Request as ExpressRequest } from 'express-serve-static-core';
import { User } from '@modules/users';
import { plainToClass } from 'class-transformer';
import { JwtAuthGuard, JwtRefreshTokenGuard, LocalAuthGuard } from './guards';
import { errorMessages } from './constants';
import { CurrentUser } from './decorators';


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

    @Post('refresh-token')
    @UseGuards(JwtRefreshTokenGuard)
    async refreshAccess(
        @Res() res: Response,
        @Request() req: ExpressRequest,
    ): Promise<void> {
        const refreshToken = req.cookies.tokens?.refreshToken;

        if (!refreshToken) {
            throw new Error(errorMessages.REFRESH_TOKEN_NOT_FOUND);
        }

        const tokens = await this.authService.refreshAccessToken(refreshToken);
        this.authService.setCookies(res, tokens);

        res.status(HttpStatus.OK).send()
    }

    @Post('sign-out')
    @UseGuards(JwtAuthGuard)
    public async signOut(
        @CurrentUser('id') id: string,
        @Res() res: Response,
    ): Promise<void> {
        await this.authService.signOut(id);
        this.authService.clearCookies(res);

        res.status(HttpStatus.OK).send()
    }
}
