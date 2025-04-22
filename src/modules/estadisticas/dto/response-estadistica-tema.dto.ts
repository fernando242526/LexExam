import { ApiProperty } from '@nestjs/swagger';
import { TemaSelectDto } from 'src/modules/temas/dto/select-tema.dto';
import { UsuarioDto } from 'src/modules/usuarios/dto/response-usuario.dto';
import { EstadisticaTema } from '../entities/estadistica.entity';

export class EstadisticaTemaDto {
  @ApiProperty({
    description: 'ID único de la estadística',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Total de preguntas contestadas',
    example: 150,
  })
  totalPreguntas: number;

  @ApiProperty({
    description: 'Total de preguntas acertadas',
    example: 120,
  })
  acertadas: number;

  @ApiProperty({
    description: 'Porcentaje de acierto',
    example: 80.0,
  })
  porcentajeAcierto: number;

  @ApiProperty({
    description: 'Número de exámenes realizados',
    example: 5,
  })
  examenesRealizados: number;

  @ApiProperty({
    description: 'Tiempo promedio por pregunta (segundos)',
    example: 45.5,
  })
  tiempoPromedio: number;

  @ApiProperty({
    description: 'Tema asociado a la estadística',
    type: TemaSelectDto,
  })
  tema?: TemaSelectDto;

  @ApiProperty({
    description: 'Usuario asociado a la estadística',
    type: UsuarioDto,
  })
  usuario?: UsuarioDto;

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

  constructor(estadistica: EstadisticaTema) {
    this.id = estadistica.id;
    this.totalPreguntas = estadistica.totalPreguntas;
    this.acertadas = estadistica.acertadas;
    this.porcentajeAcierto = estadistica.porcentajeAcierto;
    this.examenesRealizados = estadistica.examenesRealizados;
    this.tiempoPromedio = estadistica.tiempoPromedio;
    this.createdAt = estadistica.createdAt;
    this.updatedAt = estadistica.updatedAt;
    
    // Si el tema viene cargado, lo mapeamos al DTO
    if (estadistica.tema) {
      this.tema = new TemaSelectDto(estadistica.tema);
    }
    
    // Si el usuario viene cargado, lo mapeamos al DTO
    if (estadistica.usuario) {
      this.usuario = new UsuarioDto(estadistica.usuario);
    }
  }
}