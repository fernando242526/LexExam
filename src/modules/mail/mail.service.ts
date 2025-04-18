// src/modules/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  /**
   * Envía un correo electrónico para restablecer la contraseña
   */
  async sendPasswordReset(usuario: Usuario, token: string): Promise<void> {
    const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: usuario.email,
      subject: 'Restablecimiento de contraseña - LexExam',
      template: './reset-password', // Nombre del archivo de la plantilla (sin extensión)
      context: { // Datos a pasar a la plantilla
        name: usuario.nombre,
        url,
        appName: 'LexExam',
        supportEmail: process.env.SUPPORT_EMAIL || 'soporte@lexexam.com',
        expirationTime: '1 hora',
      },
    });
  }
}