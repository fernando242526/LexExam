import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength, IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTemaDto {
  @ApiProperty({
    description: 'Título del tema',
    example: 'La Constitución: Concepto y estructura',
    maxLength: 200,
  })
  @IsNotEmpty({ message: 'El título del tema es obligatorio' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @MaxLength(200, { message: 'El título no puede exceder los 200 caracteres' })
  titulo: string;

  @ApiProperty({
    description: 'Descripción del tema',
    example: 'Estudio de los conceptos fundamentales de la Constitución y su estructura jurídica',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @ApiProperty({
    description: 'Orden del tema dentro del balotario',
    example: 1,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsInt({ message: 'El orden debe ser un número entero' })
  @Min(0, { message: 'El orden debe ser mayor o igual a 0' })
  @Type(() => Number)
  orden?: number;

  @ApiProperty({
    description: 'ID del balotario al que pertenece el tema',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El ID del balotario es obligatorio' })
  @IsUUID('4', { message: 'El ID del balotario debe ser un UUID válido' })
  balotarioId: string;
}