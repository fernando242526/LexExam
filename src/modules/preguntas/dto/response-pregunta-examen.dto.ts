import { ApiProperty } from '@nestjs/swagger';
import { Pregunta } from '../entities/pregunta.entity';
import { RespuestaDto } from './response-respuesta.dto';

export class PreguntaExamenDto {
  @ApiProperty({
    description: 'ID único de la pregunta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Texto de la pregunta',
    example: '¿Cuál es la definición de Constitución?',
  })
  texto: string;

  @ApiProperty({
    description: 'Lista de respuestas posibles (sin indicar cuál es correcta)',
    type: [RespuestaDto],
  })
  respuestas: Omit<RespuestaDto, 'esCorrecta'>[];

  constructor(pregunta: Pregunta) {
    this.id = pregunta.id;
    this.texto = pregunta.texto;
    
    // Mapeamos las respuestas pero omitimos la propiedad esCorrecta
    if (pregunta.respuestas) {
      this.respuestas = pregunta.respuestas.map(respuesta => ({
        id: respuesta.id,
        texto: respuesta.texto
      }));
    } else {
      this.respuestas = [];
    }
  }
}