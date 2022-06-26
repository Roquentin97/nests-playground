import { EmailConfirmationDto } from './dtos/EmailConfirmationDto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Controller()
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post()
  async sendConfirmationEmail(@Body() payload: EmailConfirmationDto) {
    await this.mailerService.sendEmailConfirmation(payload)
  }
}
