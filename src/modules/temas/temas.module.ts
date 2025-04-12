import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tema } from './entities/tema.entity';
import { BalotariosModule } from '../balotarios/balotarios.module';
import { TemasController } from './temas.controller';
import { TemasService } from './temas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tema]),
    BalotariosModule, // Importa el módulo de balotarios para usar su servicio
  ],
  controllers: [TemasController],
  providers: [TemasService],
  exports: [TemasService],
})
export class TemasModule {}