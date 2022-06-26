import { MailerModule as MailModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      MAILER_HOST: Joi.string().required(),
      MAILER_PORT: Joi.number().required(),
      MAILER_USER: Joi.string().required(),
      MAILER_PASSWORD: Joi.string().required(),
      MAILER_SECURE: Joi.boolean(),
      PORT: Joi.number().required()
    }),
    envFilePath: './apps/mailer/.env'
  }), MailModule.forRootAsync({useFactory: async (config: ConfigService) => ({
    transport: {
      host: config.get('MAILER_HOST'),
      port: Number(config.get('MAILER_PORT')),
      secure: config.get('MAILER_SECURE'),
      auth: {
        user: config.get('MAILER_USER'),
        pass: config.get('MAILER_PASSWORD')
      }
    },
    defaults: {
      from: '"No Replay" <noreplay@example.com>'
    },
    template: {
      dir: join(__dirname, 'templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true
      }
    }
  }), inject: [ConfigService]})],
  controllers: [MailerController],
  providers: [MailerService],
  exports: [MailerService]
})
export class MailerModule {}
