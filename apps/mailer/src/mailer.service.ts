import { EmailConfirmationDto } from './dtos/EmailConfirmationDto';
import { MailerService as MailService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: MailService){}

  async sendEmailConfirmation(payload: EmailConfirmationDto) {
    const url = `example.com/auth/confirm?token=${payload.token}`
    console.log(this.mailerService)
    await this.mailerService.sendMail({
      to: payload.user.email,
      subject: 'Welcome to TheApp!',
      template: './emailconfirmation',
      context: {
        url
      }
    });
  }
}
