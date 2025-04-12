import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateRespuestaDto {
  @ApiProperty({
    description: 'Texto de la respuesta',
    example: 'La Constitución es la norma jurídica suprema del Estado',
  })
  @IsNotEmpty({ message: 'El texto de la respuesta es obligatorio' })
  @IsString({ message: 'El texto debe ser una cadena de texto' })
  texto: string;

  @ApiProperty({
    description: 'Indica si la respuesta es correcta',
    example: true,
  })
  @IsNotEmpty({ message: 'Es necesario indicar si la respuesta es correcta' })
  @IsBoolean({ message: 'El indicador de respuesta correcta debe ser un booleano' })
  esCorrecta: boolean;
}