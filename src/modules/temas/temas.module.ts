import { Module } from '@nestjs/common';
import { TemasService } from './temas.service';
import { TemasController } from './temas.controller';

@Module({
  controllers: [TemasController],
  providers: [TemasService],
})
export class TemasModule {}
