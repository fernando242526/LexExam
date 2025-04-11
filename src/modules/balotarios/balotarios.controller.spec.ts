import { Test, TestingModule } from '@nestjs/testing';
import { BalotariosController } from './balotarios.controller';
import { BalotariosService } from './balotarios.service';

describe('BalotariosController', () => {
  let controller: BalotariosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalotariosController],
      providers: [BalotariosService],
    }).compile();

    controller = module.get<BalotariosController>(BalotariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
