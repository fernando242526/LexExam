import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { RolUsuario, Usuario } from '../entities/usuario.entity';

export class UsuarioDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  nombre: string;

  @ApiProperty({
    description: 'Apellidos del usuario',
    example: 'Pérez García',
  })
  apellidos: string;

  @ApiProperty({
    description: 'Nombre completo',
    example: 'Juan Pérez García',
  })
  @Transform(({ obj }) => `${obj.nombre} ${obj.apellidos}`)
  nombreCompleto: string;

  @ApiProperty({
    description: 'Correo electrónico',
    example: 'juanperez@ejemplo.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'juanperez',
  })
  username: string;

  @Exclude()
  password: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: RolUsuario,
    example: RolUsuario.ABOGADO,
  })
  rol: RolUsuario;

  @ApiProperty({
    description: 'Indica si el usuario está activo',
    example: true,
  })
  activo: boolean;

  @ApiProperty({
    description: 'Fecha de último inicio de sesión',
    example: '2025-04-11T12:00:00Z',
    nullable: true,
  })
  ultimoLogin: Date | null;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2025-04-11T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del registro',
    example: '2025-04-11T14:30:00Z',
  })
  updatedAt: Date;

  constructor(usuario: Usuario) {
    this.id = usuario.id;
    this.nombre = usuario.nombre;
    this.apellidos = usuario.apellidos;
    this.nombreCompleto = `${usuario.nombre} ${usuario.apellidos}`;
    this.email = usuario.email;
    this.username = usuario.username;
    this.rol = usuario.rol;
    this.activo = usuario.activo;
    this.ultimoLogin = usuario.ultimoLogin;
    this.createdAt = usuario.createdAt;
    this.updatedAt = usuario.updatedAt;
  }
}