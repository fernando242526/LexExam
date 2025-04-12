import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Si la autenticación está deshabilitada en desarrollo, permitir acceso
    const isAuthEnabled = this.configService.get<string>('AUTH_ENABLED') === 'true';
    
    if (!isAuthEnabled && this.configService.get<string>('NODE_ENV') === 'development') {
      const request = context.switchToHttp().getRequest();
      request.user = {
        id: '123e4567-e89b-12d3-a456-426614174000', // ID de usuario de desarrollo
        username: 'desarrollo',
        email: 'desarrollo@ejemplo.com',
        rol: 'administrador',
      };
      return true;
    }
    
    // Si no, validar con JWT
    return super.canActivate(context);
  }
}