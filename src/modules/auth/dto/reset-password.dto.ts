import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token de restablecimiento de contraseña',
    example: 'abc123xyz456',
  })
  @IsNotEmpty({ message: 'El token es obligatorio' })
  @IsString({ message: 'El token debe ser una cadena de texto' })
  token: string;

  @ApiProperty({
    description: 'Nueva contraseña',
    example: 'NuevaContraseña123!',
  })
  @IsNotEmpty({ message: 'La nueva contraseña es obligatoria' })
  @IsString({ message: 'La nueva contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
  @MaxLength(50, { message: 'La nueva contraseña no puede exceder los 50 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/, {
    message: 'La nueva contraseña debe contener al menos una letra minúscula, una letra mayúscula y un número',
  })
  password: string;
}