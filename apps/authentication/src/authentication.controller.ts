import { CreateUserDTO } from './users/users.dto';
import { UsersService } from './users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './users/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Request, Response } from 'express';
import { CurrentUser } from './decorators/current-user.decorator';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService, 
    private readonly userService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(
    @CurrentUser() user: User,
    @Req() req: Request,
    @Res({passthrough: true}) res: Response
  ) {
    await this.authenticationService.signin(user, req, res);
    res.send();
  }

  @Post('signup')
  async signup(
    @Req() req: Request, 
    @Res({passthrough: true}) res: Response,
    @Body() dto: CreateUserDTO) {
      await this.authenticationService.signup(dto, req, res) 
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('validate_user')
  async validateUser(@CurrentUser() user: User) {
    return this.userService.sanitize(user, 'safe');
  }

  @Get('hello')
  async hello(){
    return 'hello'
  }

}
