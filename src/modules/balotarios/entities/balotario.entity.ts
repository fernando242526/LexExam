import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Tema } from '../../temas/entities/tema.entity';
import { Especialidad } from 'src/modules/especialidades/entities/especialidade.entity';

@Entity('balotarios')
export class Balotario {
  @ApiProperty({ description: 'ID único del balotario' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nombre del balotario' })
  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @ApiProperty({ description: 'Descripción del balotario' })
  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @ApiProperty({ description: 'Año del balotario' })
  @Column({ type: 'int', nullable: true })
  anio: number | null;

  @ApiProperty({ description: 'Institución del balotario' })
  @Column({ type: 'varchar', length: 150, nullable: true })
  institucion: string | null;

  @ApiProperty({ description: 'Indica si el balotario está activo' })
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización del registro' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Especialidad, (especialidad) => especialidad.balotarios, { nullable: false })
  @JoinColumn({ name: 'especialidad_id' })
  especialidad: Especialidad;

  @OneToMany(() => Tema, (tema) => tema.balotario)
  temas: Tema[];
}