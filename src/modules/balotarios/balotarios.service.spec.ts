import { Test, TestingModule } from '@nestjs/testing';
import { BalotariosService } from './balotarios.service';

describe('BalotariosService', () => {
  let service: BalotariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalotariosService],
    }).compile();

    service = module.get<BalotariosService>(BalotariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
