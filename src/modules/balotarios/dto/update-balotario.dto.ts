import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBalotarioDto } from './create-balotario.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateBalotarioDto extends PartialType(CreateBalotarioDto) {

}