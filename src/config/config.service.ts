import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV') || 'development';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get port(): number {
    return this.configService.get<number>('PORT') || 3000;
  }

  get host(): string {
    return this.configService.get<string>('HOST') || 'localhost';
  }

  get apiPrefix(): string {
    return this.configService.get<string>('API_PREFIX') || 'api';
  }

  get database() {
    return {
        host: this.configService.get<string>('DB_HOST') || 'localhost',
        port: parseInt(this.configService.get('DB_PORT') || '5432', 10),
        username: this.configService.get<string>('DB_USERNAME') || 'postgres',
        password: this.configService.get<string>('DB_PASSWORD') || '',
        database: this.configService.get<string>('DB_DATABASE') || 'lexexam',
        schema: this.configService.get<string>('DB_SCHEMA') || 'public',
        synchronize: this.configService.get<boolean>('DB_SYNCHRONIZE') === true || 
                    this.configService.get('DB_SYNCHRONIZE') === 'true',
        logging: this.configService.get<boolean>('DB_LOGGING') === true || 
                 this.configService.get('DB_LOGGING') === 'true',
    };
  }

  get jwt() {
    return {
      secret: this.configService.get<string>('JWT_SECRET') || 'default_secret_key',
      expiresIn: this.configService.get<string>('JWT_EXPIRATION') || '1d',
      refreshExpiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
    };
  }

  get swagger() {
    return {
      title: this.configService.get<string>('SWAGGER_TITLE') || 'LexExam API',
      description: this.configService.get<string>('SWAGGER_DESCRIPTION') || 'API Documentation',
      version: this.configService.get<string>('SWAGGER_VERSION') || '1.0',
      path: this.configService.get<string>('SWAGGER_PATH') || 'docs',
    };
  }

  get logLevel(): string {
    return this.configService.get<string>('LOG_LEVEL') || 'info';
  }
}