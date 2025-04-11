import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Balotario } from '../../balotarios/entities/balotario.entity';

@Entity('especialidades')
export class Especialidad {
  @ApiProperty({ description: 'ID único de la especialidad' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nombre de la especialidad' })
  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @ApiProperty({ description: 'Descripción de la especialidad' })
  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @ApiProperty({ description: 'Indica si la especialidad está activa' })
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización del registro' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => Balotario, (balotario) => balotario.especialidad)
  balotarios: Balotario[];
}