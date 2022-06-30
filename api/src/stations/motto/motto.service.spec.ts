import { Test, TestingModule } from '@nestjs/testing';
import { MottoService } from './motto.service';

describe('MottoService', () => {
  let service: MottoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MottoService],
    }).compile();

    service = module.get<MottoService>(MottoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
