import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTemaDto } from './create-tema.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateTemaDto extends PartialType(CreateTemaDto) {
  @ApiProperty({
    description: 'Indica si el tema está activo',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  activo?: boolean;
}