import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback_secret_for_development',
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.authService.validateUser(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('Usuario no existe o no está activo');
      }
      
      // Usamos consistentemente 'id' como identificador
      return {
        id: payload.sub, // Convertimos el 'sub' del token JWT a 'id'
        username: payload.username,
        email: payload.email,
        rol: payload.rol,
      };
    } catch (error) {
      console.error('Error in JWT validation:', error);
      throw error;
    }
  }
}