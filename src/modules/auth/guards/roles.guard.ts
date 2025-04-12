import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Si no hay roles requeridos, permitir acceso
    if (!requiredRoles) {
      return true;
    }
    
    // Si la autenticación está deshabilitada en desarrollo, permitir acceso
    const isAuthEnabled = this.configService.get<string>('AUTH_ENABLED') === 'true';
    
    if (!isAuthEnabled && this.configService.get<string>('NODE_ENV') === 'development') {
      return true;
    }
    
    // Obtener usuario de la solicitud
    const { user } = context.switchToHttp().getRequest();
    
    // Verificar rol
    return requiredRoles.includes(user.rol);
  }
}