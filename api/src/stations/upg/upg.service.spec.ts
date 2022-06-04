import { Test, TestingModule } from '@nestjs/testing';
import { UpgService } from './upg.service';

describe('UpgService', () => {
  let service: UpgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpgService],
    }).compile();

    service = module.get<UpgService>(UpgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
