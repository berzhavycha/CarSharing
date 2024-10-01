import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { ConfirmEmailDto } from '@/dtos';
import { User } from '@/entities';
import { authErrorMessages } from '@/helpers';
import { VerificationTokenPayload } from '@/interfaces';

import { EmailService } from './email.service';
import { UsersService } from './users.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public sendVerificationLink(email: string) {
    const EMAIL_SUBJECT = 'Email confirmation';
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')}`,
    });

    const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}?token=${token}`;

    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: EMAIL_SUBJECT,
      text,
    });
  }

  async confirmEmail(confirmationData: ConfirmEmailDto): Promise<User | null> {
    const email = await this.decodeConfirmationToken(confirmationData.token);

    const user = await this.usersService.findByEmail(email);

    if (user.isEmailConfirmed) {
      throw new BadRequestException(authErrorMessages.EMAIL_CONFIRMED);
    }

    return this.usersService.updateUser(user.id, { isEmailConfirmed: true });
  }

  async decodeConfirmationToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }

      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException(
          authErrorMessages.EXPIRED_EMAIL_CONFIRMATION_TOKEN,
        );
      }
      throw new BadRequestException(
        authErrorMessages.INVALID_EMAIL_CONFIRMATION_TOKEN,
      );
    }
  }
}
