import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Examen } from './entities/examen.entity';
import { ResultadoExamen } from './entities/resultado-examen.entity';
import { RespuestaUsuario } from './entities/respuesta-usuario.entity';
import { TemasModule } from '../temas/temas.module';
import { PreguntasModule } from '../preguntas/preguntas.module';
import { ExamenesController } from './examenes.controller';
import { ExamenesService } from './examenes.service';
import { EstadisticasModule } from '../estadisticas/estadisticas.module';
import { AuthModule } from '../auth/auth.module';
import { ExamenPregunta } from './entities/examen-pregunta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Examen, ResultadoExamen, RespuestaUsuario, ExamenPregunta]),
    TemasModule,
    PreguntasModule,
    EstadisticasModule, // Importa el módulo de estadísticas para usar su servicio
    AuthModule
  ],
  controllers: [ExamenesController],
  providers: [ExamenesService],
  exports: [ExamenesService],
})
export class ExamenesModule {}