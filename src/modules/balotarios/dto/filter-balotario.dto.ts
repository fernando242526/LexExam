import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsUUID, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FilterBalotarioDto extends PaginationDto {
  @ApiProperty({
    description: 'Filtrar por nombre de balotario',
    example: 'Jueces',
    required: false,
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({
    description: 'Filtrar por institución',
    example: 'Poder Judicial',
    required: false,
  })
  @IsOptional()
  @IsString()
  institucion?: string;

  @ApiProperty({
    description: 'Filtrar por año',
    example: 2025,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  anio?: number;

  @ApiProperty({
    description: 'Filtrar por ID de especialidad',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  especialidadId?: string;

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
    example: 'nombre',
    required: false,
    enum: ['nombre', 'anio', 'institucion', 'createdAt'],
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'nombre';

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