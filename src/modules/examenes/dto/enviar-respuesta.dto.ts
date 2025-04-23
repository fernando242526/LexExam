import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsArray, ValidateNested, ArrayMinSize, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class RespuestaExamenDto {
  @ApiProperty({
    description: 'ID de la pregunta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El ID de la pregunta es obligatorio' })
  @IsUUID('4', { message: 'El ID de la pregunta debe ser un UUID válido' })
  preguntaId: string;

  @ApiProperty({
    description: 'ID de la respuesta seleccionada',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID de la respuesta debe ser un UUID válido' })
  respuestaId: string | null;
}

export class EnviarRespuestasDto {
  @ApiProperty({
    description: 'ID del examen',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El ID del examen es obligatorio' })
  @IsUUID('4', { message: 'El ID del examen debe ser un UUID válido' })
  examenId: string;

  @ApiProperty({
    description: 'Respuestas del usuario',
    type: [RespuestaExamenDto],
    example: [
      {
        preguntaId: '123e4567-e89b-12d3-a456-426614174000',
        respuestaId: '123e4567-e89b-12d3-a456-426614174001'
      }
    ]
  })
  @IsArray({ message: 'Las respuestas deben ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => RespuestaExamenDto)
  @ArrayMinSize(1, { message: 'Debe incluir al menos una respuesta' })
  respuestas: RespuestaExamenDto[];
}