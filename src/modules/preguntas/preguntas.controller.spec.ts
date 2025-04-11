import { Test, TestingModule } from '@nestjs/testing';
import { PreguntasController } from './preguntas.controller';
import { PreguntasService } from './preguntas.service';

describe('PreguntasController', () => {
  let controller: PreguntasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreguntasController],
      providers: [PreguntasService],
    }).compile();

    controller = module.get<PreguntasController>(PreguntasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
