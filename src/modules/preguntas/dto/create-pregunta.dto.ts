import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  ValidateNested,
  ArrayMinSize,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRespuestaDto } from './create-respuesta.dto';
import { NivelDificultad } from '../entities/pregunta.entity';

export class CreatePreguntaDto {
  @ApiProperty({
    description: 'Texto de la pregunta',
    example: '¿Cuál es la definición de Constitución?',
  })
  @IsNotEmpty({ message: 'El texto de la pregunta es obligatorio' })
  @IsString({ message: 'El texto debe ser una cadena de texto' })
  texto: string;

  @ApiProperty({
    description: 'Explicación adicional de la pregunta (opcional)',
    example:
      'La Constitución es la norma fundamental de un Estado que define su organización política',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La explicación debe ser una cadena de texto' })
  explicacion?: string;

  @ApiProperty({
    description: 'Nivel de dificultad de la pregunta',
    enum: NivelDificultad,
    default: NivelDificultad.MEDIO,
    example: NivelDificultad.MEDIO,
  })
  @IsOptional()
  @IsEnum(NivelDificultad, { message: 'El nivel de dificultad debe ser uno válido' })
  nivelDificultad?: NivelDificultad = NivelDificultad.MEDIO;

  @ApiProperty({
    description: 'Indica si la pregunta está activa',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  activo?: boolean;

  @ApiProperty({
    description: 'Lista de posibles respuestas',
    type: [CreateRespuestaDto],
    example: [
      {
        texto: 'La Constitución es la norma jurídica suprema del Estado',
        esCorrecta: true,
      },
      {
        texto: 'La Constitución es un simple documento político sin valor jurídico',
        esCorrecta: false,
      },
    ],
  })
  @IsArray({ message: 'Las respuestas deben ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => CreateRespuestaDto)
  @ArrayMinSize(2, { message: 'La pregunta debe tener al menos 2 respuestas' })
  respuestas: CreateRespuestaDto[];
}