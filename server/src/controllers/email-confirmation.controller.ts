import { Body, Controller, Patch } from '@nestjs/common';

import { ConfirmEmailDto } from '@/dtos';
import { User } from '@/entities';
import { EmailConfirmationService } from '@/services';

@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Patch()
  async confirm(
    @Body() confirmationData: ConfirmEmailDto,
  ): Promise<User | null> {
    return this.emailConfirmationService.confirmEmail(confirmationData);
  }
}
