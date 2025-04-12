import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsUUID, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { NivelDificultad } from '../entities/pregunta.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FilterPreguntaDto extends PaginationDto {
  @ApiProperty({
    description: 'Filtrar por texto de pregunta',
    example: 'Constitución',
    required: false,
  })
  @IsOptional()
  @IsString()
  texto?: string;

  @ApiProperty({
    description: 'Filtrar por ID de tema',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  temaId?: string;

  @ApiProperty({
    description: 'Filtrar por nivel de dificultad',
    enum: NivelDificultad,
    required: false,
  })
  @IsOptional()
  @IsEnum(NivelDificultad)
  nivelDificultad?: NivelDificultad;

  @ApiProperty({
    description: 'Filtrar por estado (activo/inactivo)',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  activo?: boolean;

  @ApiProperty({
    description: 'Ordenar por campo',
    example: 'createdAt',
    required: false,
    enum: ['texto', 'nivelDificultad', 'createdAt'],
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({
    description: 'Orden ascendente o descendente',
    example: 'DESC',
    required: false,
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC' = 'DESC';
}