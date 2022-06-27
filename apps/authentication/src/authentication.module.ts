import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { config } from 'process';
import { RmqModule } from '@app/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // database
        DB: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_SYNCHRONIZE: Joi.boolean(),
        // JWT
        SAME_SITE_COOKIES: Joi.string(),
        JWT_ACCESS_EXPIRATION: Joi.number().required(),
        JWT_REFRESH_EXPIRATION: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        // RMQ
        RABBIT_MQ_URI: Joi.string().required(),
        //RABBIT_MQ_${queue}_QUEUE: Joi.string().required(),
        // general
        NODE_ENV: Joi.string(),
        PORT: Joi.number().required(),
        CLIENT_DOMAIN: Joi.string(),

      }),
      envFilePath: './apps/authentication/.env'
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: ((config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB'),
        synchronize: config.get('DB_SYNCHRONIZE'),
        autoLoadEntities: true
      })),
    }),
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
      })
    }),
    UsersModule,
    RmqModule
  ],
  
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy],
})
export class AuthenticationModule {}
