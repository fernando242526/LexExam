import { ApiProperty } from '@nestjs/swagger';
import { Respuesta } from '../entities/respuesta.entity';

export class RespuestaDto {
  @ApiProperty({
    description: 'ID único de la respuesta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Texto de la respuesta',
    example: 'La Constitución es la norma jurídica suprema del Estado',
  })
  texto: string;

  @ApiProperty({
    description: 'Indica si la respuesta es correcta',
    example: true,
  })
  esCorrecta: boolean;

  constructor(respuesta: Respuesta) {
    this.id = respuesta.id;
    this.texto = respuesta.texto;
    this.esCorrecta = respuesta.esCorrecta;
  }
}