import { ApiProperty } from '@nestjs/swagger';
import { Examen } from '../entities/examen.entity';
import { RespuestaUsuario } from '../entities/respuesta-usuario.entity';

// Importa ambos tipos de DTOs de preguntas
import { PreguntaExamenDto } from 'src/modules/preguntas/dto/response-pregunta-examen.dto';
import { PreguntaDto } from 'src/modules/preguntas/dto/response-pregunta.dto';
 // Ajusta la ruta según tu estructura

export class RespuestaPreviaDTO {
  @ApiProperty({ description: 'ID de la pregunta' })
  preguntaId: string;

  @ApiProperty({ description: 'ID de la respuesta seleccionada', nullable: true })
  respuestaId: string | null;
}

export class ExamenConPreguntasRespuestasDTO {
  @ApiProperty({ description: 'ID del examen' })
  id: string;

  @ApiProperty({ description: 'Título del examen' })
  titulo: string;

  @ApiProperty({ description: 'ID del tema' })
  temaId: string;

  @ApiProperty({ description: 'Título del tema' })
  temaTitulo: string;

  @ApiProperty({ description: 'Duración en minutos' })
  duracionMinutos: number;

  @ApiProperty({ description: 'Número de preguntas' })
  numeroPreguntas: number;

  @ApiProperty({ description: 'Estado del examen' })
  estado: string;

  @ApiProperty({ description: 'Fecha de inicio', nullable: true })
  fechaInicio: Date | null;

  @ApiProperty({ description: 'Fecha de fin', nullable: true })
  fechaFin: Date | null;

  @ApiProperty({ description: 'Lista de preguntas' })
  preguntas: any[]; // Usamos any[] para que acepte ambos tipos

  @ApiProperty({ description: 'Lista de respuestas previas', nullable: true })
  respuestasPrevias: RespuestaPreviaDTO[];

  constructor(examen: Examen, preguntas: PreguntaDto[] | PreguntaExamenDto[], respuestasUsuario: RespuestaUsuario[] = []) {
    this.id = examen.id;
    this.titulo = examen.titulo;
    this.temaId = examen.tema.id;
    this.temaTitulo = examen.tema.titulo;
    this.duracionMinutos = examen.duracionMinutos;
    this.numeroPreguntas = examen.numeroPreguntas;
    this.estado = examen.estado;
    this.fechaInicio = examen.fechaInicio;
    this.fechaFin = examen.fechaFin;
    this.preguntas = preguntas; // Ahora acepta ambos tipos
    
    // Mapear respuestas previas si existen
    if (respuestasUsuario && respuestasUsuario.length > 0) {
      this.respuestasPrevias = respuestasUsuario.map(ru => ({
        preguntaId: ru.pregunta.id,
        respuestaId: ru.respuesta ? ru.respuesta.id : null
      }));
    } else {
      this.respuestasPrevias = [];
    }
  }
}