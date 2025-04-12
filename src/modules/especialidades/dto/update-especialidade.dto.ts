import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreateEspecialidadDto } from './create-especialidade.dto';

export class UpdateEspecialidadDto extends PartialType(CreateEspecialidadDto) {
  @ApiProperty({
    description: 'Indica si la especialidad está activa',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  activo?: boolean;
}