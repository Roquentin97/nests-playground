import { EmailConfirmationDto } from './dtos/EmailConfirmationDto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @EventPattern('user_created')
  sendConfirmationEmail(@Payload() payload: EmailConfirmationDto) {
    this.mailerService.sendEmailConfirmation(payload);
  }
}
