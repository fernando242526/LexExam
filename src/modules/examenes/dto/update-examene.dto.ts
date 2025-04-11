import { PartialType } from '@nestjs/mapped-types';
import { CreateExameneDto } from './create-examene.dto';

export class UpdateExameneDto extends PartialType(CreateExameneDto) {}
