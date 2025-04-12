import { ApiProperty } from '@nestjs/swagger';

class PuntoRendimientoDto {
  @ApiProperty({
    description: 'Fecha del examen',
    example: '2025-04-11',
  })
  fecha: string;

  @ApiProperty({
    description: 'Puntuación obtenida',
    example: 85,
  })
  puntuacion: number;
}

export class EvolucionRendimientoDto {
  @ApiProperty({
    description: 'Puntos de rendimiento a lo largo del tiempo',
    type: [PuntoRendimientoDto],
  })
  puntosRendimiento: PuntoRendimientoDto[];

  @ApiProperty({
    description: 'Puntuación promedio histórica',
    example: 78.5,
  })
  promedioHistorico: number;

  @ApiProperty({
    description: 'Tendencia (positiva, negativa o estable)',
    example: 'positiva',
    enum: ['positiva', 'negativa', 'estable'],
  })
  tendencia: 'positiva' | 'negativa' | 'estable';
}