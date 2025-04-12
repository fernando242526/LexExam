import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBalotarioDto } from './create-balotario.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateBalotarioDto extends PartialType(CreateBalotarioDto) {
  @ApiProperty({
    description: 'Indica si el balotario está activo',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  activo?: boolean;
}