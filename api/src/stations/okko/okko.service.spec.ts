import { Test, TestingModule } from '@nestjs/testing';
import { OkkoService } from './okko.service';

describe('OkkoService', () => {
  let service: OkkoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OkkoService],
    }).compile();

    service = module.get<OkkoService>(OkkoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
