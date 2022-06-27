import { PGQueryErrorFilter } from '@app/common/filters/PgQueryError.filter';
import { ConfigService } from '@nestjs/config';
import { RmqOptions } from '@nestjs/microservices';
import { RmqService } from './../../../libs/common/src/rmq/rmq.service';
import { NestFactory } from '@nestjs/core';
import { AuthenticationModule } from './authentication.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthenticationModule);
  const rmq = app.get<RmqService>(RmqService);
  const config = app.get(ConfigService);
  app.connectMicroservice<RmqOptions>(rmq.getOptions('AUTH', true));
  app.useGlobalFilters(new  PGQueryErrorFilter())
  app.useGlobalPipes(new ValidationPipe())
  const PORT = config.get('PORT')
  await app.listen(PORT, ()=>Logger.log('Listening on port ' + PORT))
}

bootstrap();
