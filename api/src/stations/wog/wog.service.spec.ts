import { Test, TestingModule } from '@nestjs/testing';
import { WogService } from './wog.service';

describe('WogService', () => {
  let service: WogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WogService],
    }).compile();

    service = module.get<WogService>(WogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
