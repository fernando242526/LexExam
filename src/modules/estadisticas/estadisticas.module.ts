import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultadoExamen } from '../examenes/entities/resultado-examen.entity';
import { EstadisticasController } from './estadisticas.controller';
import { EstadisticaTema } from './entities/estadistica.entity';
import { EstadisticasService } from './estadisticas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EstadisticaTema, ResultadoExamen]),
  ],
  controllers: [EstadisticasController],
  providers: [EstadisticasService],
  exports: [EstadisticasService],
})
export class EstadisticasModule {}