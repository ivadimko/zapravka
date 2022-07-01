import { Test, TestingModule } from '@nestjs/testing';
import { AmicService } from './amic.service';

describe('AmicService', () => {
  let service: AmicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmicService],
    }).compile();

    service = module.get<AmicService>(AmicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
