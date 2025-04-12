import { ApiProperty } from '@nestjs/swagger';
import { Especialidad } from '../entities/especialidade.entity';

export class EspecialidadDto {
  @ApiProperty({
    description: 'ID único de la especialidad',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de la especialidad',
    example: 'Derecho Constitucional',
  })
  nombre: string;

  @ApiProperty({
    description: 'Descripción de la especialidad',
    example: 'Rama del derecho público que estudia la Constitución',
    nullable: true,
  })
  descripcion: string | null;

  @ApiProperty({
    description: 'Indica si la especialidad está activa',
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

  constructor(especialidad: Especialidad) {
    this.id = especialidad.id;
    this.nombre = especialidad.nombre;
    this.descripcion = especialidad.descripcion;
    this.activo = especialidad.activo;
    this.createdAt = especialidad.createdAt;
    this.updatedAt = especialidad.updatedAt;
  }
}