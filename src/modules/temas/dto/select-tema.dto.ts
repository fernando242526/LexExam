import { ApiProperty } from '@nestjs/swagger';
import { Tema } from '../entities/tema.entity';
import { BalotarioSelectDto } from 'src/modules/balotarios/dto/select-balotario.dto';

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
    description: 'Balotario al que pertenece el Tema',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  balotario: BalotarioSelectDto;

  constructor(tema: Tema) {
    this.id = tema.id;
    this.titulo = tema.titulo;
    this.balotario = tema.balotario;
  }
}