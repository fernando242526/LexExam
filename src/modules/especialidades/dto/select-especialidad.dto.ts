import { ApiProperty } from '@nestjs/swagger';
import { Especialidad } from '../entities/especialidade.entity';

export class EspecialidadSelectDto {
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

  constructor(especialidad: Especialidad) {
    this.id = especialidad.id;
    this.nombre = especialidad.nombre;
  }
}