import { Resolver, Query } from '@nestjs/graphql';
import { StationsService } from '@/stations/stations.service';
import { Station } from '@/stations/models/station.model';

@Resolver()
export class StationsResolver {
  constructor(private stationsService: StationsService) {}

  @Query(() => [Station])
  async stations() {
    return this.stationsService.findAll();
  }
}
