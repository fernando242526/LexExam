import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty({ description: 'Página actual' })
  currentPage: number;
  
  @ApiProperty({ description: 'Elementos por página' })
  itemsPerPage: number;
  
  @ApiProperty({ description: 'Total de elementos' })
  totalItems: number;
  
  @ApiProperty({ description: 'Total de páginas' })
  totalPages: number;
  
  @ApiProperty({ description: '¿Hay página anterior?' })
  hasPreviousPage: boolean;
  
  @ApiProperty({ description: '¿Hay página siguiente?' })
  hasNextPage: boolean;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Datos paginados' })
  data: T[];

  @ApiProperty({ description: 'Metadatos de paginación', type: PaginationMeta })
  meta: PaginationMeta;
}