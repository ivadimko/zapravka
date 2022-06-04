import { Test, TestingModule } from '@nestjs/testing';
import { StationsResolver } from './stations.resolver';

describe('StationsResolver', () => {
  let resolver: StationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StationsResolver],
    }).compile();

    resolver = module.get<StationsResolver>(StationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
