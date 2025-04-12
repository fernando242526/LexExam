import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsUUID, 
  IsArray, 
  ValidateNested, 
  ArrayMinSize 
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePreguntaDto } from './create-pregunta.dto';

export class CreatePreguntasMasivoDto {
  @ApiProperty({
    description: 'ID del tema al que pertenecen las preguntas',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El ID del tema es obligatorio' })
  @IsUUID('4', { message: 'El ID del tema debe ser un UUID válido' })
  temaId: string;

  @ApiProperty({
    description: 'Listado de preguntas a crear',
    type: [CreatePreguntaDto],
    example: [
      {
        texto: '¿Cuál es la definición de Constitución?',
        nivelDificultad: 'MEDIO',
        respuestas: [
          {
            texto: 'La Constitución es la norma jurídica suprema',
            esCorrecta: true
          },
          {
            texto: 'Un documento sin valor jurídico',
            esCorrecta: false
          }
        ]
      },
      {
        texto: '¿Qué es el Estado de Derecho?',
        nivelDificultad: 'MEDIO',
        respuestas: [
          {
            texto: 'Aquel donde predomina la ley',
            esCorrecta: true
          },
          {
            texto: 'Cualquier forma de gobierno',
            esCorrecta: false
          }
        ]
      }
    ]
  })
  @IsArray({ message: 'Las preguntas deben ser un arreglo' })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Debe incluir al menos una pregunta' })
  @Type(() => CreatePreguntaDto)
  preguntas: CreatePreguntaDto[];
}