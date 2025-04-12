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
    description: 'ID de la pregunta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  preguntaId: string;

  @ApiProperty({
    description: 'Respuesta seleccionada',
    type: RespuestaDto,
  })
  respuesta?: RespuestaDto;

  @ApiProperty({
    description: 'ID de la respuesta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  respuestaId: string;

  @ApiProperty({
    description: 'ID del resultado del examen',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  resultadoExamenId: string;

  constructor(respuestaUsuario: RespuestaUsuario) {
    this.id = respuestaUsuario.id;
    this.esCorrecta = respuestaUsuario.esCorrecta;
    this.tiempoRespuesta = respuestaUsuario.tiempoRespuesta;
    this.preguntaId = respuestaUsuario.preguntaId;
    this.respuestaId = respuestaUsuario.respuestaId;
    this.resultadoExamenId = respuestaUsuario.resultadoExamenId;
    
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