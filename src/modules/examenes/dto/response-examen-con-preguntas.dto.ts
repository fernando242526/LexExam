import { ApiProperty } from '@nestjs/swagger';
import { ExamenDto } from './response-examen.dto';
import { PreguntaExamenDto } from 'src/modules/preguntas/dto/response-pregunta-examen.dto';
import { Examen } from '../entities/examen.entity';

export class ExamenConPreguntasDto extends ExamenDto {
  @ApiProperty({
    description: 'Preguntas del examen',
    type: [PreguntaExamenDto],
  })
  preguntas: PreguntaExamenDto[];

  constructor(examen: Examen, preguntas: PreguntaExamenDto[]) {
    super(examen);
    this.preguntas = preguntas;
  }
}