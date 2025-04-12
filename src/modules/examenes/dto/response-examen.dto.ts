import { ApiProperty } from '@nestjs/swagger';
import { EstadoExamen, Examen } from '../entities/examen.entity';
import { TemaSelectDto } from 'src/modules/temas/dto/select-tema.dto';

export class ExamenDto {
  @ApiProperty({
    description: 'ID único del examen',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Título del examen',
    example: 'Examen de Derecho Constitucional - Tema: La Constitución',
  })
  titulo: string;

  @ApiProperty({
    description: 'Duración del examen en minutos',
    example: 60,
  })
  duracionMinutos: number;

  @ApiProperty({
    description: 'Número de preguntas del examen',
    example: 30,
  })
  numeroPreguntas: number;

  @ApiProperty({
    description: 'Fecha y hora de inicio del examen',
    example: '2025-04-11T12:00:00Z',
    nullable: true,
  })
  fechaInicio: Date | null;

  @ApiProperty({
    description: 'Fecha y hora de finalización del examen',
    example: '2025-04-11T13:00:00Z',
    nullable: true,
  })
  fechaFin: Date | null;

  @ApiProperty({
    description: 'Estado del examen',
    enum: EstadoExamen,
    example: EstadoExamen.PENDIENTE,
  })
  estado: EstadoExamen;

  @ApiProperty({
    description: 'Tema del examen',
    type: TemaSelectDto,
  })
  tema?: TemaSelectDto;

  @ApiProperty({
    description: 'ID del tema',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  temaId: string;

  @ApiProperty({
    description: 'ID del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  usuarioId: string;

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

  constructor(examen: Examen) {
    this.id = examen.id;
    this.titulo = examen.titulo;
    this.duracionMinutos = examen.duracionMinutos;
    this.numeroPreguntas = examen.numeroPreguntas;
    this.fechaInicio = examen.fechaInicio;
    this.fechaFin = examen.fechaFin;
    this.estado = examen.estado;
    this.temaId = examen.temaId;
    this.usuarioId = examen.usuarioId;
    this.createdAt = examen.createdAt;
    this.updatedAt = examen.updatedAt;
    
    // Si el tema viene cargado, lo mapeamos al DTO
    if (examen.tema) {
      this.tema = new TemaSelectDto(examen.tema);
    }
  }
}