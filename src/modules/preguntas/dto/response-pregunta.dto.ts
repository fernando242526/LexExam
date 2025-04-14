import { ApiProperty } from '@nestjs/swagger';
import { NivelDificultad, Pregunta } from '../entities/pregunta.entity';
import { TemaSelectDto } from 'src/modules/temas/dto/select-tema.dto';
import { RespuestaDto } from './response-respuesta.dto';

export class PreguntaDto {
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
    description: 'Explicación adicional de la pregunta',
    example: 'La Constitución es la norma fundamental de un Estado que define su organización política',
    nullable: true,
  })
  explicacion: string | null;

  @ApiProperty({
    description: 'Nivel de dificultad de la pregunta',
    enum: NivelDificultad,
    example: NivelDificultad.MEDIO,
  })
  nivelDificultad: NivelDificultad;

  @ApiProperty({
    description: 'Tema al que pertenece la pregunta',
    type: TemaSelectDto,
  })
  tema?: TemaSelectDto;

  @ApiProperty({
    description: 'Lista de respuestas posibles',
    type: [RespuestaDto],
  })
  respuestas: RespuestaDto[];

  @ApiProperty({
    description: 'Indica si la pregunta está activa',
    example: true,
  })
  activo: boolean;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2025-04-11T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del registro',
    example: '2025-04-11T14:30:00Z',
  })
  updatedAt: Date;

  constructor(pregunta: Pregunta) {
    this.id = pregunta.id;
    this.texto = pregunta.texto;
    this.explicacion = pregunta.explicacion;
    this.nivelDificultad = pregunta.nivelDificultad;
    this.activo = pregunta.activo;
    this.createdAt = pregunta.createdAt;
    this.updatedAt = pregunta.updatedAt;
    
    // Si el tema viene cargado, lo mapeamos al DTO
    if (pregunta.tema) {
      this.tema = new TemaSelectDto(pregunta.tema);
    }
    
    // Si las respuestas vienen cargadas, las mapeamos a DTOs
    if (pregunta.respuestas) {
      this.respuestas = pregunta.respuestas.map(respuesta => new RespuestaDto(respuesta));
    } else {
      this.respuestas = [];
    }
  }
}