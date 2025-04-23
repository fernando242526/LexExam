import { ApiProperty } from '@nestjs/swagger';
import { PreguntaDto } from 'src/modules/preguntas/dto/response-pregunta.dto';
import { RespuestaDto } from 'src/modules/preguntas/dto/response-respuesta.dto';
import { RespuestaUsuario } from '../entities/respuesta-usuario.entity';

export class RespuestaUsuarioDto {
  @ApiProperty({
    description: 'ID único de la respuesta del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Indica si la respuesta fue correcta',
    example: true,
  })
  esCorrecta: boolean;

  @ApiProperty({
    description: 'Tiempo en segundos que tardó en responder',
    example: 45,
    nullable: true,
  })
  tiempoRespuesta: number | null;

  @ApiProperty({
    description: 'Pregunta asociada',
    type: PreguntaDto,
  })
  pregunta?: PreguntaDto;

  @ApiProperty({
    description: 'Respuesta seleccionada',
    type: RespuestaDto,
    nullable: true,
  })
  respuesta?: RespuestaDto | null;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2025-04-11T12:30:15Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del registro',
    example: '2025-04-11T12:30:15Z',
  })
  updatedAt: Date;

  constructor(respuestaUsuario: RespuestaUsuario) {
    this.id = respuestaUsuario.id;
    this.esCorrecta = respuestaUsuario.esCorrecta;
    this.tiempoRespuesta = respuestaUsuario.tiempoRespuesta;
    this.createdAt = respuestaUsuario.createdAt;
    this.updatedAt = respuestaUsuario.updatedAt;
    
    // Si la pregunta viene cargada, la mapeamos al DTO
    if (respuestaUsuario.pregunta) {
      this.pregunta = new PreguntaDto(respuestaUsuario.pregunta);
    }
    
    // Si la respuesta viene cargada, la mapeamos al DTO
    if (respuestaUsuario.respuesta) {
      this.respuesta = new RespuestaDto(respuestaUsuario.respuesta);
    }
  }
}