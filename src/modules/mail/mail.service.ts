import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Envía un correo electrónico para restablecer la contraseña
   */
  async sendPasswordReset(usuario: Usuario, token: string): Promise<void> {
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:4200';
    const url = `${frontendUrl}/auth/reset-password?token=${token}`;
    const supportEmail = this.configService.get('SUPPORT_EMAIL') || 'soporte@lexexam.com';

    try {
      this.logger.log(`Enviando correo de restablecimiento a ${usuario.email}`);

      const info = await this.mailerService.sendMail({
        to: usuario.email,
        subject: 'Restablecimiento de contraseña - LexExam',
        template: './reset-password', // Nombre del archivo de la plantilla (sin extensión)
        context: {
          // Datos a pasar a la plantilla
          name: usuario.nombre,
          url,
          appName: 'LexExam',
          supportEmail,
          expirationTime: '1 hora',
          currentYear: new Date().getFullYear(),
        },
      });
      // Mostrar la URL del correo en consola (solo en desarrollo)
      if (process.env.NODE_ENV !== 'production') {
        const nodemailer = require('nodemailer');
        const testAccount = {
          user: this.configService.get('MAIL_USER'),
          pass: this.configService.get('MAIL_PASSWORD'),
        };
        const transporter = nodemailer.createTransport({
          host: this.configService.get('MAIL_HOST'),
          port: this.configService.get('MAIL_PORT'),
          secure: false,
          auth: testAccount,
        });

        this.logger.log('📩 Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }

      this.logger.log(`Correo de restablecimiento enviado a ${usuario.email}`);
    } catch (error) {
      this.logger.error(`Error al enviar correo de restablecimiento a ${usuario.email}`, error);
      throw error;
    }
  }
}
