import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength, IsUUID, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBalotarioDto {
  @ApiProperty({
    description: 'Nombre del balotario',
    example: 'Balotario para examen de jueces 2025',
    maxLength: 150,
  })
  @IsNotEmpty({ message: 'El nombre del balotario es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(150, { message: 'El nombre no puede exceder los 150 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'Descripción del balotario',
    example: 'Contenido para preparación al concurso nacional de jueces',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @ApiProperty({
    description: 'Año del balotario',
    example: 2025,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'El año debe ser un número entero' })
  @Min(2000, { message: 'El año debe ser mayor o igual a 2000' })
  @Max(2100, { message: 'El año debe ser menor o igual a 2100' })
  @Type(() => Number)
  anio?: number;

  @ApiProperty({
    description: 'Institución del balotario',
    example: 'Poder Judicial del Perú',
    required: false,
    maxLength: 150,
  })
  @IsOptional()
  @IsString({ message: 'La institución debe ser una cadena de texto' })
  @MaxLength(150, { message: 'La institución no puede exceder los 150 caracteres' })
  institucion?: string;

  @ApiProperty({
    description: 'ID de la especialidad a la que pertenece el balotario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El ID de la especialidad es obligatorio' })
  @IsUUID('4', { message: 'El ID de la especialidad debe ser un UUID válido' })
  especialidadId: string;
}