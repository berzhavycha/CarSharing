import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { PaymentAppModule } from './payment-app.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentAppModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: configService.get('TCP_HOST') ?? '0.0.0.0',
      port: configService.get('TCP_PORT') ?? '4003',
    },
  });

  const port = process.env.PORT || process.argv[2] || 4005;

  await app.listen(port);
  await app.startAllMicroservices();
}
bootstrap();
