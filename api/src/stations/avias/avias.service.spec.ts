import { Test, TestingModule } from '@nestjs/testing';
import { AviasService } from './avias.service';

describe('AviasService', () => {
  let service: AviasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AviasService],
    }).compile();

    service = module.get<AviasService>(AviasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
