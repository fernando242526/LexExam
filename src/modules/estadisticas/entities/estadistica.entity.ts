import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Tema } from '../../temas/entities/tema.entity';

@Entity('estadisticas_temas')
export class EstadisticaTema {
  @ApiProperty({ description: 'ID único de la estadística' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Total de preguntas contestadas' })
  @Column({ type: 'int', default: 0 })
  totalPreguntas: number;

  @ApiProperty({ description: 'Total de preguntas acertadas' })
  @Column({ type: 'int', default: 0 })
  acertadas: number;

  @ApiProperty({ description: 'Porcentaje de acierto' })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  porcentajeAcierto: number;

  @ApiProperty({ description: 'Número de exámenes realizados' })
  @Column({ type: 'int', default: 0 })
  examenesRealizados: number;

  @ApiProperty({ description: 'Tiempo promedio por pregunta (segundos)' })
  @Column({ type: 'decimal', precision: 7, scale: 2, default: 0 })
  tiempoPromedio: number;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización del registro' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relaciones
  @ApiProperty({ description: 'Usuario asociado a la estadística', type: () => Usuario })
  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ApiProperty({ description: 'Tema asociado a la estadística', type: () => Tema })
  @ManyToOne(() => Tema, { nullable: false })
  @JoinColumn({ name: 'tema_id' })
  tema: Tema;
}