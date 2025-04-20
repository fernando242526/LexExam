import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tema } from '../../temas/entities/tema.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { ResultadoExamen } from './resultado-examen.entity';

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
  @ManyToOne(() => Tema, { nullable: false })
  @JoinColumn({ name: 'tema_id' })
  tema: Tema;

  @Column({ name: 'tema_id' ,type: 'uuid' })
  temaId: string;

  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'usuario_id', type: 'uuid' })
  usuarioId: string;

  @OneToMany(() => ResultadoExamen, (resultadoExamen) => resultadoExamen.examen)
  resultados: ResultadoExamen[];
}