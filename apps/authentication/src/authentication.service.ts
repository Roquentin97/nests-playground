import { CreateUserDTO } from './users/users.dto';
import { ConfigService } from '@nestjs/config';
import { User } from './users/user.entity';
import { UsersService } from './users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { CookieOptions, Request, Response } from 'express';

export const CookieTypes = {
  JWT_REFRESH: "jwt_rfr",
  JWT_ACCESS: "jwt"
};

export type TokenPayload = {
  id: number,
  email?: string
}


@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService, 
    private readonly jwtService: JwtService, 
    private readonly configService: ConfigService) {
      this.PAST = new Date();
      this.PAST.setFullYear(1900);
    }

  private PAST: Date;
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne({email});
    return await compare(password, user.password) ? this.usersService.sanitize(user, 'safe') : null;
  }

  private cookieOptions(
    req: Request,
  ): CookieOptions {
    return this.configService.get('NODE_ENV') === 'production'  ?  {
          secure: req.secure || req.headers["x-forwarded-proto"] === "https",
          sameSite: this.configService.get('SAME_SITE_COOKIES') || 'strict',
          domain: this.configService.get('DOMAIN'),
        }
      : {
          secure: true,
          sameSite: this.configService.get('SAME_SITE_COOKIES') || 'strict',
          domain: "localhost",
        };
  };
  private attachAccessToken(req: Request, res: Response, token: string, options?: CookieOptions) {
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this.configService.get('JWT_ACCESS_EXPIRATION'));
    res.cookie(CookieTypes.JWT_ACCESS, token, {
      path: "/",
      httpOnly: true,
      expires,
      ...this.cookieOptions(req),
      ...options,
    });
    
  }

  private attachRefreshToken(req: Request, res: Response, token: string, options?: CookieOptions) {
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this.configService.get('JWT_REFRESH_EXPIRATION'));
    res.cookie(CookieTypes.JWT_REFRESH, token, {
      path: "/",
      httpOnly: true,
      expires,
      ...this.cookieOptions(req),
      ...options
    });
  }

  async signup(dto: CreateUserDTO, request: Request, response: Response) {
    const user = await this.usersService.create(dto);
    const payload = {id: user.id};
    const accessToken = this.jwtService.sign(payload, {expiresIn: `${this.configService.get('JWT_ACCESS_EXPIRATION')}s`});
    this.attachAccessToken(request, response, accessToken)
    //this.attachRefreshToken(request, response, token)
  }
  async signin(user: User, request: Request, response: Response) {
    const payload = {id: user.id}

    const accessToken = this.jwtService.sign(payload);
    this.attachAccessToken(request, response, accessToken);
    //this.attachRefreshToken(request, response, token)
  }

  async logout(request: Request, response: Response){
    this.attachAccessToken(request, response, 'a.a.a', {expires: this.PAST});
  }
}
