import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request as ExpressRequest, Response } from 'express-serve-static-core';

import { CurrentUser } from '@/decorators';
import { LoginUserDto, RegisterUserDto } from '@/dtos';
import { User } from '@/entities';
import { JwtAuthGuard, JwtRefreshTokenGuard, LocalAuthGuard } from '@/guards';
import { authErrorMessages } from '@/helpers';
import { RequestWithUser } from '@/interfaces';
import { AuthService } from '@/services';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(
    @Body() userDto: RegisterUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const { user, tokens } = await this.authService.signUp(userDto);
    this.authService.setTokensCookies(res, tokens);

    const transformedUser = plainToClass(User, user);
    res.status(HttpStatus.CREATED).json(transformedUser);
  }

  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  async signIn(
    @Body() userDto: LoginUserDto,
    @Res() res: Response,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    const { user, tokens } = await this.authService.signIn(req.user);
    this.authService.setTokensCookies(res, tokens);

    res.status(HttpStatus.OK).json(user);
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshTokenGuard)
  async refreshAccess(
    @Res() res: Response,
    @Req() req: ExpressRequest,
  ): Promise<void> {
    const refreshToken = req.cookies.tokens?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException(authErrorMessages.REFRESH_TOKEN_NOT_FOUND);
    }

    const tokens = await this.authService.refreshAccessToken(refreshToken);
    this.authService.setTokensCookies(res, tokens);

    res.status(HttpStatus.OK).send();
  }

  @Post('sign-out')
  @UseGuards(JwtAuthGuard)
  async signOut(
    @CurrentUser('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.authService.signOut(id);
    this.authService.clearTokensCookies(res);

    res.status(HttpStatus.OK).send();
  }

  @Get('current-user')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: User): Promise<User | null> {
    if (user) return user;
    return null;
  }
}
