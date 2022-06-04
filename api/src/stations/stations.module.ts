import { Module } from '@nestjs/common';
import { StationsResolver } from './stations.resolver';
import { StationsService } from './stations.service';
import { OkkoService } from './okko/okko.service';

@Module({
  providers: [StationsResolver, StationsService, OkkoService]
})
export class StationsModule {}
