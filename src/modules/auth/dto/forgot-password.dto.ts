import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com',
  })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido' })
  @IsString({ message: 'El correo electrónico debe ser una cadena de texto' })
  email: string;
}