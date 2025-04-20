import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Examen } from './examen.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { RespuestaUsuario } from './respuesta-usuario.entity';

@Entity('resultados_examenes')
export class ResultadoExamen {
  @ApiProperty({ description: 'ID único del resultado del examen' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Puntuación total obtenida' })
  @Column({ type: 'int' })
  puntuacionTotal: number;

  @ApiProperty({ description: 'Número de preguntas acertadas' })
  @Column({ type: 'int' })
  preguntasAcertadas: number;

  @ApiProperty({ description: 'Número total de preguntas' })
  @Column({ type: 'int' })
  totalPreguntas: number;

  @ApiProperty({ description: 'Porcentaje de acierto' })
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  porcentajeAcierto: number;

  @ApiProperty({ description: 'Duración real del examen en minutos' })
  @Column({ type: 'int' })
  duracionReal: number;

  @ApiProperty({ description: 'Fecha y hora de inicio del intento' })
  @Column({ type: 'timestamp' })
  fechaInicio: Date;

  @ApiProperty({ description: 'Fecha y hora de finalización del intento' })
  @Column({ type: 'timestamp' })
  fechaFin: Date;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización del registro' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Examen, (examen) => examen.resultados, { nullable: false })
  @JoinColumn({ name: 'examen_id' })
  examen: Examen;

  @Column({ name: 'examen_id', type: 'uuid' })
  examenId: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.resultadosExamenes, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'usuario_id', type: 'uuid' })
  usuarioId: string;

  @OneToMany(() => RespuestaUsuario, (respuestaUsuario) => respuestaUsuario.resultadoExamen, { cascade: true })
  respuestasUsuario: RespuestaUsuario[];
}