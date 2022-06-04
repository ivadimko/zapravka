import { Test, TestingModule } from '@nestjs/testing';
import { SocarService } from './socar.service';

describe('SocarService', () => {
  let service: SocarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocarService],
    }).compile();

    service = module.get<SocarService>(SocarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
