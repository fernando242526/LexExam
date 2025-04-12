import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { CreatePreguntaDto } from './create-pregunta.dto';
import { IsOptional, IsBoolean, ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateRespuestaDto } from './update-respuesta.dto';

export class UpdatePreguntaDto extends PartialType(OmitType(CreatePreguntaDto, ['respuestas'])) {
  @ApiProperty({
    description: 'Indica si la pregunta está activa',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  activo?: boolean;

  @ApiProperty({
    description: 'Lista de respuestas (para actualización)',
    type: [UpdateRespuestaDto],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Las respuestas deben ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => UpdateRespuestaDto)
  @ArrayMinSize(2, { message: 'La pregunta debe tener al menos 2 respuestas' })
  respuestas?: UpdateRespuestaDto[];
}