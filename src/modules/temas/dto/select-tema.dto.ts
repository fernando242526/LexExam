import { ApiProperty } from '@nestjs/swagger';
import { Tema } from '../entities/tema.entity';

export class TemaSelectDto {
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
    description: 'ID del balotario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  balotarioId: string;

  constructor(tema: Tema) {
    this.id = tema.id;
    this.titulo = tema.titulo;
    this.balotarioId = tema.balotarioId;
  }
}