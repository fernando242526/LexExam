import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Nombre de usuario o correo electrónico',
    example: 'juanperez',
  })
  @IsNotEmpty({ message: 'El nombre de usuario o correo electrónico es obligatorio' })
  @IsString({ message: 'El nombre de usuario o correo electrónico debe ser una cadena de texto' })
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Contraseña123!',
  })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  password: string;
}