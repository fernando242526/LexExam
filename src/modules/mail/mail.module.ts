import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST', 'smtp.ethereal.email'),
          port: configService.get('MAIL_PORT', 587),
          secure: configService.get('MAIL_SECURE', false),
          auth: {
            user: configService.get('MAIL_USER', 'ethereal_user'),
            pass: configService.get('MAIL_PASSWORD', 'ethereal_password'),
          },
        },
        defaults: {
          from: `"LexExam" <${configService.get('MAIL_FROM', 'noreply@lexexam.com')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}