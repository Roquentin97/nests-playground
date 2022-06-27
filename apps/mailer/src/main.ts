import { RmqService } from './../../../libs/common/src/rmq/rmq.service';
import { NestFactory } from '@nestjs/core';
import { MailerModule } from './mailer.module';
console.log(process.env.MAILER_HOST)
async function bootstrap() {
  const app = await NestFactory.create(MailerModule);
  const rmq = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmq.getOptions('MAILER'))
  await app.startAllMicroservices();
}
bootstrap();
