import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsEnum, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoExamen } from '../entities/examen.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FilterExamenDto extends PaginationDto {
  @ApiProperty({
    description: 'Filtrar por ID del tema',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  temaId?: string;

  @ApiProperty({
    description: 'Filtrar por ID del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  usuarioId?: string;

  @ApiProperty({
    description: 'Filtrar por estado del examen',
    enum: EstadoExamen,
    required: false,
  })
  @IsOptional()
  @IsEnum(EstadoExamen)
  estado?: EstadoExamen;

  @ApiProperty({
    description: 'Filtrar por fecha de inicio (desde)',
    example: '2025-04-11T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @ApiProperty({
    description: 'Filtrar por fecha de inicio (hasta)',
    example: '2025-04-12T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaHasta?: string;

  @ApiProperty({
    description: 'Ordenar por campo',
    example: 'createdAt',
    required: false,
    enum: ['createdAt', 'fechaInicio', 'fechaFin'],
  })
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiProperty({
    description: 'Orden ascendente o descendente',
    example: 'DESC',
    required: false,
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  order?: 'ASC' | 'DESC' = 'DESC';
}