import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTemaDto } from './create-tema.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateTemaDto extends PartialType(CreateTemaDto) {
}