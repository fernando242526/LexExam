import { ApiProperty } from '@nestjs/swagger';
import { ExamenDto } from './response-examen.dto';
import { ResultadoExamen } from '../entities/resultado-examen.entity';
import { RespuestaUsuarioDto } from './response-respuesta-usuario.dto';

export class ResultadoExamenDto {
  @ApiProperty({
    description: 'ID único del resultado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Puntuación total obtenida',
    example: 42,
  })
  puntuacionTotal: number;

  @ApiProperty({
    description: 'Número de preguntas acertadas',
    example: 21,
  })
  preguntasAcertadas: number;

  @ApiProperty({
    description: 'Número total de preguntas',
    example: 30,
  })
  totalPreguntas: number;

  @ApiProperty({
    description: 'Porcentaje de acierto',
    example: 70.0,
  })
  porcentajeAcierto: number;

  @ApiProperty({
    description: 'Duración real del examen en minutos',
    example: 45,
  })
  duracionReal: number;

  @ApiProperty({
    description: 'Fecha y hora de inicio del intento',
    example: '2025-04-11T12:00:00Z',
  })
  fechaInicio: Date;

  @ApiProperty({
    description: 'Fecha y hora de finalización del intento',
    example: '2025-04-11T12:45:00Z',
  })
  fechaFin: Date;

  @ApiProperty({
    description: 'Examen asociado al resultado',
    type: ExamenDto,
  })
  examen?: ExamenDto;

  @ApiProperty({
    description: 'ID del examen',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  examenId: string;

  @ApiProperty({
    description: 'ID del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  usuarioId: string;

  @ApiProperty({
    description: 'Respuestas del usuario',
    type: [RespuestaUsuarioDto],
  })
  respuestasUsuario?: RespuestaUsuarioDto[];

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2025-04-11T12:45:30Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del registro',
    example: '2025-04-11T12:45:30Z',
  })
  updatedAt: Date;

  constructor(resultado: ResultadoExamen) {
    this.id = resultado.id;
    this.puntuacionTotal = resultado.puntuacionTotal;
    this.preguntasAcertadas = resultado.preguntasAcertadas;
    this.totalPreguntas = resultado.totalPreguntas;
    this.porcentajeAcierto = resultado.porcentajeAcierto;
    this.duracionReal = resultado.duracionReal;
    this.fechaInicio = resultado.fechaInicio;
    this.fechaFin = resultado.fechaFin;
    this.examenId = resultado.examenId;
    this.usuarioId = resultado.usuarioId;
    this.createdAt = resultado.createdAt;
    this.updatedAt = resultado.updatedAt;
    
    // Si el examen viene cargado, lo mapeamos al DTO
    if (resultado.examen) {
      this.examen = new ExamenDto(resultado.examen);
    }
    
    // Si las respuestas vienen cargadas, las mapeamos a DTOs
    if (resultado.respuestasUsuario) {
      this.respuestasUsuario = resultado.respuestasUsuario.map(
        resp => new RespuestaUsuarioDto(resp)
      );
    }
  }
}