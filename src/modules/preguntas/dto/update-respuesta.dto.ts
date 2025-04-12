import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRespuestaDto } from './create-respuesta.dto';
import { IsUUID, IsOptional } from 'class-validator';

export class UpdateRespuestaDto extends PartialType(CreateRespuestaDto) {
  @ApiProperty({
    description: 'ID de la respuesta (solo para actualización)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID de la respuesta debe ser un UUID válido' })
  id?: string;
}