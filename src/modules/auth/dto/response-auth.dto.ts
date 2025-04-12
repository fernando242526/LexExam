import { ApiProperty } from '@nestjs/swagger';
import { RolUsuario } from 'src/modules/usuarios/entities/usuario.entity';

export class AuthDto {
  @ApiProperty({
    description: 'Token de acceso',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Token de actualización',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'ID del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'juanperez',
  })
  username: string;

  @ApiProperty({
    description: 'Correo electrónico',
    example: 'juanperez@ejemplo.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nombre completo',
    example: 'Juan Pérez García',
  })
  nombreCompleto: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: RolUsuario,
    example: RolUsuario.ABOGADO,
  })
  rol: RolUsuario;

  @ApiProperty({
    description: 'Fecha de expiración del token',
    example: '2025-04-12T15:00:00Z',
  })
  expiresAt: Date;
}