import { ApiProperty } from '@nestjs/swagger';
import { Balotario } from '../entities/balotario.entity';
import { EspecialidadSelectDto } from 'src/modules/especialidades/dto/select-especialidad.dto';

export class BalotarioSelectDto {
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
    description: 'Especialidad a la que pertenece el balotario',
    type: EspecialidadSelectDto,
  })
  especialidad: EspecialidadSelectDto;

  constructor(balotario: Balotario) {
    this.id = balotario.id;
    this.nombre = balotario.nombre;
    this.especialidad = balotario.especialidad;
  }
}
