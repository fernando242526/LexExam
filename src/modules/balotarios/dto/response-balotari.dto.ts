import { ApiProperty } from '@nestjs/swagger';
import { EspecialidadSelectDto } from 'src/modules/especialidades/dto/select-especialidad.dto';
import { Balotario } from '../entities/balotario.entity';

export class BalotarioDto {
  @ApiProperty({
    description: 'ID único del balotario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del balotario',
    example: 'Balotario para examen de jueces 2025',
  })
  nombre: string;

  @ApiProperty({
    description: 'Descripción del balotario',
    example: 'Contenido para preparación al concurso nacional de jueces',
    nullable: true,
  })
  descripcion: string | null;

  @ApiProperty({
    description: 'Año del balotario',
    example: 2025,
    nullable: true,
  })
  anio: number | null;

  @ApiProperty({
    description: 'Institución del balotario',
    example: 'Poder Judicial del Perú',
    nullable: true,
  })
  institucion: string | null;

  @ApiProperty({
    description: 'Especialidad a la que pertenece el balotario',
    type: EspecialidadSelectDto,
  })
  especialidad: EspecialidadSelectDto;

  @ApiProperty({
    description: 'ID de la especialidad',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  especialidadId: string;

  @ApiProperty({
    description: 'Indica si el balotario está activo',
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

  constructor(balotario: Balotario) {
    this.id = balotario.id;
    this.nombre = balotario.nombre;
    this.descripcion = balotario.descripcion;
    this.anio = balotario.anio;
    this.institucion = balotario.institucion;
    this.especialidadId = balotario.especialidadId;
    this.activo = balotario.activo;
    this.createdAt = balotario.createdAt;
    this.updatedAt = balotario.updatedAt;
    
    // Si la especialidad viene cargada, la mapeamos al DTO
    if (balotario.especialidad) {
      this.especialidad = new EspecialidadSelectDto(balotario.especialidad);
    }
  }
}