import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FilterEspecialidadDto extends PaginationDto {
  @ApiProperty({
    description: 'Filtrar por nombre de especialidad',
    example: 'Constitucional',
    required: false,
  })
  @IsOptional()
  @IsString()
  nombre?: string;

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
    description: 'Ordenar por campo (nombre, createdAt)',
    example: 'nombre',
    required: false,
    enum: ['nombre', 'createdAt'],
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