import { Module } from '@nestjs/common';
import { BalotariosService } from './balotarios.service';
import { BalotariosController } from './balotarios.controller';

@Module({
  controllers: [BalotariosController],
  providers: [BalotariosService],
})
export class BalotariosModule {}
