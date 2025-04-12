import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balotario } from './entities/balotario.entity';
import { EspecialidadesModule } from '../especialidades/especialidades.module';
import { BalotariosController } from './balotarios.controller';
import { BalotariosService } from './balotarios.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Balotario]),
    EspecialidadesModule, // Importa el módulo de especialidades para usar su servicio
  ],
  controllers: [BalotariosController],
  providers: [BalotariosService],
  exports: [BalotariosService],
})
export class BalotariosModule {}