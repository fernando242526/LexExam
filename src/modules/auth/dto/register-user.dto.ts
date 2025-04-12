import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength, MaxLength, Matches, IsEnum, IsOptional } from 'class-validator';
import { RolUsuario } from 'src/modules/usuarios/entities/usuario.entity';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'Apellidos del usuario',
    example: 'Pérez García',
  })
  @IsNotEmpty({ message: 'Los apellidos son obligatorios' })
  @IsString({ message: 'Los apellidos deben ser una cadena de texto' })
  @MaxLength(100, { message: 'Los apellidos no pueden exceder los 100 caracteres' })
  apellidos: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juanperez@ejemplo.com',
  })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido' })
  @MaxLength(255, { message: 'El correo electrónico no puede exceder los 255 caracteres' })
  email: string;

  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'juanperez',
  })
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  @MinLength(4, { message: 'El nombre de usuario debe tener al menos 4 caracteres' })
  @MaxLength(50, { message: 'El nombre de usuario no puede exceder los 50 caracteres' })
  @Matches(/^[a-zA-Z0-9._-]+$/, { message: 'El nombre de usuario solo puede contener letras, números, puntos, guiones bajos y guiones' })
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Contraseña123!',
  })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(50, { message: 'La contraseña no puede exceder los 50 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/, {
    message: 'La contraseña debe contener al menos una letra minúscula, una letra mayúscula y un número',
  })
  password: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: RolUsuario,
    example: RolUsuario.ABOGADO,
    required: false,
  })
  @IsOptional()
  @IsEnum(RolUsuario, { message: 'El rol debe ser un valor válido' })
  rol?: RolUsuario;
}