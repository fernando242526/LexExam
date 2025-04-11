import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Balotario } from '../../balotarios/entities/balotario.entity';
import { Pregunta } from '../../preguntas/entities/pregunta.entity';

@Entity('temas')
export class Tema {
  @ApiProperty({ description: 'ID único del tema' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Título del tema' })
  @Column({ type: 'varchar', length: 200 })
  titulo: string;

  @ApiProperty({ description: 'Descripción del tema' })
  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @ApiProperty({ description: 'Orden del tema dentro del balotario' })
  @Column({ type: 'int', default: 0 })
  orden: number;

  @ApiProperty({ description: 'Indica si el tema está activo' })
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización del registro' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Balotario, (balotario) => balotario.temas, { nullable: false })
  @JoinColumn({ name: 'balotario_id' })
  balotario: Balotario;

  @Column({ type: 'uuid' })
  balotarioId: string;

  @OneToMany(() => Pregunta, (pregunta) => pregunta.tema)
  preguntas: Pregunta[];
}