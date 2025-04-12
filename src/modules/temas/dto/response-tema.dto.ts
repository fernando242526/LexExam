import { ApiProperty } from '@nestjs/swagger';
import { BalotarioSelectDto } from 'src/modules/balotarios/dto/select-balotario.dto';
import { Tema } from '../entities/tema.entity';

export class TemaDto {
  @ApiProperty({
    description: 'ID único del tema',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Título del tema',
    example: 'La Constitución: Concepto y estructura',
  })
  titulo: string;

  @ApiProperty({
    description: 'Descripción del tema',
    example: 'Estudio de los conceptos fundamentales de la Constitución y su estructura jurídica',
    nullable: true,
  })
  descripcion: string | null;

  @ApiProperty({
    description: 'Orden del tema dentro del balotario',
    example: 1,
  })
  orden: number;

  @ApiProperty({
    description: 'Balotario al que pertenece el tema',
    type: BalotarioSelectDto,
  })
  balotario?: BalotarioSelectDto;

  @ApiProperty({
    description: 'ID del balotario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  balotarioId: string;

  @ApiProperty({
    description: 'Indica si el tema está activo',
    example: true,
  })
  activo: boolean;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2025-04-11T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del registro',
    example: '2025-04-11T14:30:00Z',
  })
  updatedAt: Date;

  constructor(tema: Tema) {
    this.id = tema.id;
    this.titulo = tema.titulo;
    this.descripcion = tema.descripcion;
    this.orden = tema.orden;
    this.balotarioId = tema.balotarioId;
    this.activo = tema.activo;
    this.createdAt = tema.createdAt;
    this.updatedAt = tema.updatedAt;
    
    // Si el balotario viene cargado, lo mapeamos al DTO
    if (tema.balotario) {
      this.balotario = new BalotarioSelectDto(tema.balotario);
    }
  }
}