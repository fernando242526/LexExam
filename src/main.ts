import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { setupSwagger } from './config/swagger.config';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import * as nodemailer from 'nodemailer';

async function setupEtherealEmailAccount() {
  if (process.env.NODE_ENV !== 'production') {
    try {
      // Generar cuenta de prueba en Ethereal
      const testAccount = await nodemailer.createTestAccount();
      
      console.log('Cuenta Ethereal generada:');
      console.log('- Email:', testAccount.user);
      console.log('- Contraseña:', testAccount.pass);
      console.log('- URL de visualización:', `https://ethereal.email/login`);
      console.log('Utiliza estas credenciales para ver los correos enviados durante las pruebas.');
      console.log('Puedes actualizar tu archivo .env con estos valores.');
      
      // Establecer variables de entorno dinámicamente
      process.env.MAIL_USER = testAccount.user;
      process.env.MAIL_PASSWORD = testAccount.pass;
    } catch (error) {
      console.error('Error al crear cuenta de Ethereal:', error);
    }
  }
}

async function bootstrap() {
  // Configurar cuenta de Ethereal para desarrollo
  if (process.env.NODE_ENV !== 'production') {
    await setupEtherealEmailAccount();
  }
  
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Prefijo global para todas las rutas
  app.setGlobalPrefix(configService.apiPrefix);
  
  // Configuración CORS
  app.enableCors();
  
  // Pipes globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // Filtros e interceptores globales
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );
  
  // Configuración de Swagger
  setupSwagger(app);
  
  // Iniciar servidor
  await app.listen(configService.port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();