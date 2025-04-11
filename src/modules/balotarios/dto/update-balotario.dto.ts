import { PartialType } from '@nestjs/mapped-types';
import { CreateBalotarioDto } from './create-balotario.dto';

export class UpdateBalotarioDto extends PartialType(CreateBalotarioDto) {}
