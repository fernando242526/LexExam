import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FilterTemaDto extends PaginationDto {
  @ApiProperty({
    description: 'Filtrar por título de tema',
    example: 'Constitución',
    required: false,
  })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiProperty({
    description: 'Filtrar por ID de balotario',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  balotarioId?: string;

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
    example: 'orden',
    required: false,
    enum: ['titulo', 'orden', 'createdAt'],
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'orden';

  @ApiProperty({
    description: 'Orden ascendente o descendente',
    example: 'ASC',
    required: false,
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC' = 'ASC';
}