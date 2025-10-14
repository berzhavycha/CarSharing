import { NestFactory } from '@nestjs/core';

import { FileAppModule } from './file-app.module';

async function bootstrap() {
  const app = await NestFactory.create(FileAppModule);
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
