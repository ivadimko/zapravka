import { Test, TestingModule } from '@nestjs/testing';
import { BrsmService } from './brsm.service';

describe('BrsmService', () => {
  let service: BrsmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrsmService],
    }).compile();

    service = module.get<BrsmService>(BrsmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
