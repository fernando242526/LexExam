import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreateEspecialidadDto } from './create-especialidade.dto';

export class UpdateEspecialidadDto extends PartialType(CreateEspecialidadDto) {
  
}