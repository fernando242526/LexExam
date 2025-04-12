import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateEspecialidadDto {
  @ApiProperty({
    description: 'Nombre de la especialidad',
    example: 'Derecho Constitucional',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'El nombre de la especialidad es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'Descripción de la especialidad',
    example: 'Rama del derecho público que estudia la Constitución',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;
}