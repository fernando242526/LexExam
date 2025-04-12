import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pregunta } from './entities/pregunta.entity';
import { Respuesta } from './entities/respuesta.entity';
import { TemasModule } from '../temas/temas.module';
import { PreguntasService } from './preguntas.service';
import { PreguntasController } from './preguntas.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pregunta, Respuesta]),
    TemasModule, // Importa el módulo de temas para usar su servicio
  ],
  controllers: [PreguntasController],
  providers: [PreguntasService],
  exports: [PreguntasService],
})
export class PreguntasModule {}