import { Module } from '@nestjs/common';
import { StationsResolver } from './stations.resolver';
import { StationsService } from './stations.service';

@Module({
  providers: [StationsResolver, StationsService]
})
export class StationsModule {}
