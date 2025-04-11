import { Module } from '@nestjs/common';
import { PreguntasService } from './preguntas.service';
import { PreguntasController } from './preguntas.controller';

@Module({
  controllers: [PreguntasController],
  providers: [PreguntasService],
})
export class PreguntasModule {}
