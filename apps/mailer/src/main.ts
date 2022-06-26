import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MailerModule } from './mailer.module';
async function bootstrap() {
  const app = await NestFactory.create(MailerModule);
  const configService = app.get(ConfigService)
  await app.listen(configService.get('PORT'));
}
bootstrap();
