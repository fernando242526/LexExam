import { ApiProperty } from '@nestjs/swagger';

export class ResumenEstadisticasDto {
  @ApiProperty({
    description: 'Cantidad total de exámenes realizados',
    example: 30,
  })
  totalExamenes: number;

  @ApiProperty({
    description: 'Cantidad total de preguntas respondidas',
    example: 750,
  })
  totalPreguntas: number;

  @ApiProperty({
    description: 'Cantidad total de respuestas correctas',
    example: 600,
  })
  totalAciertos: number;

  @ApiProperty({
    description: 'Porcentaje global de aciertos',
    example: 80.0,
  })
  porcentajeGlobalAciertos: number;

  @ApiProperty({
    description: 'Cantidad de temas estudiados',
    example: 15,
  })
  temasEstudiados: number;

  @ApiProperty({
    description: 'Tiempo total de estudio en minutos',
    example: 1200,
  })
  tiempoTotalEstudio: number;

  @ApiProperty({
    description: 'Puntuación promedio de exámenes',
    example: 78.5,
  })
  puntuacionPromedio: number;

  @ApiProperty({
    description: 'Mejor puntuación obtenida',
    example: 95,
  })
  mejorPuntuacion: number;

  @ApiProperty({
    description: 'Tema con mejor rendimiento',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      titulo: 'La Constitución: Concepto y Estructura',
      porcentajeAcierto: 92.5
    },
  })
  mejorTema: {
    id: string;
    titulo: string;
    porcentajeAcierto: number;
  } | null;
}