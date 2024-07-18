import { Provider } from '@nestjs/common';

import { NODE_ENV } from '@/helpers';
import { DevLoggerService, LoggerService, ProdLoggerService } from '@/services';

export const loggerProvider: Provider = {
  provide: LoggerService,
  useClass:
    process.env.NODE_ENV === NODE_ENV.production
      ? ProdLoggerService
      : DevLoggerService,
};
