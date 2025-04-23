import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class RespuestaParcialDto {
  @ApiProperty({ description: 'ID de la pregunta' })
  @IsUUID()
  preguntaId: string;

  @ApiProperty({ description: 'ID de la respuesta seleccionada', nullable: true })
  @IsOptional()
  @IsUUID()
  respuestaId: string | null;
}

export class GuardarRespuestasParcialesDto {
  @ApiProperty({ description: 'ID del examen' })
  @IsUUID()
  examenId: string;

  @ApiProperty({ description: 'Lista de respuestas', type: [RespuestaParcialDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RespuestaParcialDto)
  respuestas: RespuestaParcialDto[];
}