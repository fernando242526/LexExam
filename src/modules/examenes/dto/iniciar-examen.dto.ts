import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class IniciarExamenDto {
  @ApiProperty({
    description: 'ID del examen a iniciar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El ID del examen es obligatorio' })
  @IsUUID('4', { message: 'El ID del examen debe ser un UUID válido' })
  examenId: string;
}