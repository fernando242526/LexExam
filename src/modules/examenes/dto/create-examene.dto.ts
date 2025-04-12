import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearExamenDto {
  @ApiProperty({
    description: 'ID del tema del examen',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El ID del tema es obligatorio' })
  @IsUUID('4', { message: 'El ID del tema debe ser un UUID válido' })
  temaId: string;

  @ApiProperty({
    description: 'Duración del examen en minutos',
    example: 60,
    minimum: 5,
    maximum: 180,
  })
  @IsNotEmpty({ message: 'La duración en minutos es obligatoria' })
  @IsInt({ message: 'La duración debe ser un número entero' })
  @Min(5, { message: 'La duración mínima es de 5 minutos' })
  @Max(180, { message: 'La duración máxima es de 180 minutos' })
  @Type(() => Number)
  duracionMinutos: number;

  @ApiProperty({
    description: 'Número de preguntas del examen',
    example: 30,
    minimum: 5,
    maximum: 100,
  })
  @IsNotEmpty({ message: 'El número de preguntas es obligatorio' })
  @IsInt({ message: 'El número de preguntas debe ser un número entero' })
  @Min(5, { message: 'El mínimo de preguntas es 5' })
  @Max(100, { message: 'El máximo de preguntas es 100' })
  @Type(() => Number)
  numeroPreguntas: number;
}