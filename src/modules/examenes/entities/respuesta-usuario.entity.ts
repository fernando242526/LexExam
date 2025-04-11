import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ResultadoExamen } from './resultado-examen.entity';
import { Pregunta } from '../../preguntas/entities/pregunta.entity';
import { Respuesta } from '../../preguntas/entities/respuesta.entity';

@Entity('respuestas_usuarios')
export class RespuestaUsuario {
  @ApiProperty({ description: 'ID único de la respuesta del usuario' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Indica si la respuesta fue correcta' })
  @Column({ type: 'boolean' })
  esCorrecta: boolean;

  @ApiProperty({ description: 'Tiempo en segundos que tardó en responder' })
  @Column({ type: 'int', nullable: true })
  tiempoRespuesta: number | null;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización del registro' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => ResultadoExamen, (resultadoExamen) => resultadoExamen.respuestasUsuario, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resultado_examen_id' })
  resultadoExamen: ResultadoExamen;

  @Column({ type: 'uuid' })
  resultadoExamenId: string;

  @ManyToOne(() => Pregunta, (pregunta) => pregunta.respuestasUsuarios, { nullable: false })
  @JoinColumn({ name: 'pregunta_id' })
  pregunta: Pregunta;

  @Column({ type: 'uuid' })
  preguntaId: string;

  @ManyToOne(() => Respuesta, (respuesta) => respuesta.respuestasUsuarios, { nullable: false })
  @JoinColumn({ name: 'respuesta_id' })
  respuesta: Respuesta;

  @Column({ type: 'uuid' })
  respuestaId: string;
}