import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tema } from '../../temas/entities/tema.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { ResultadoExamen } from './resultado-examen.entity';
import { ExamenPregunta } from './examen-pregunta.entity';

export enum EstadoExamen {
  PENDIENTE = 'pendiente',
  INICIADO = 'iniciado',
  FINALIZADO = 'finalizado',
  CADUCADO = 'caducado'
}

@Entity('examenes')
export class Examen {
  @ApiProperty({ description: 'ID único del examen' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Título del examen' })
  @Column({ type: 'varchar', length: 200 })
  titulo: string;

  @ApiProperty({ description: 'Duración del examen en minutos' })
  @Column({ type: 'int' })
  duracionMinutos: number;

  @ApiProperty({ description: 'Número de preguntas del examen' })
  @Column({ type: 'int' })
  numeroPreguntas: number;

  @ApiProperty({ description: 'Fecha y hora de inicio del examen' })
  @Column({ type: 'timestamp', nullable: true })
  fechaInicio: Date | null;

  @ApiProperty({ description: 'Fecha y hora de finalización del examen' })
  @Column({ type: 'timestamp', nullable: true })
  fechaFin: Date | null;

  @ApiProperty({ description: 'Estado del examen', enum: EstadoExamen })
  @Column({
    type: 'enum',
    enum: EstadoExamen,
    default: EstadoExamen.PENDIENTE
  })
  estado: EstadoExamen;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización del registro' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relaciones
  @ApiProperty({ description: 'Tema asociado al examen', type: () => Tema })
  @ManyToOne(() => Tema, { nullable: false })
  @JoinColumn({ name: 'tema_id' })
  tema: Tema;

  @ApiProperty({ description: 'Usuario asociado al examen', type: () => Usuario })
  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ApiProperty({ description: 'Resultados del examen', type: () => [ResultadoExamen] })
  @OneToMany(() => ResultadoExamen, (resultadoExamen) => resultadoExamen.examen)
  resultados: ResultadoExamen[];

  @OneToMany(() => ExamenPregunta, (examenPregunta) => examenPregunta.examen)
  examenPreguntas: ExamenPregunta[];
}