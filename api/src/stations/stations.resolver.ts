import { Resolver, Query, Args } from '@nestjs/graphql';
import { StationsService } from '@/stations/stations.service';
import { Station } from '@/stations/models/station.model';
import { StationProvider } from '@/stations/stations.typedefs';

@Resolver()
export class StationsResolver {
  constructor(private stationsService: StationsService) {}

  @Query(() => [Station])
  async stations() {
    return this.stationsService.findAll();
  }

  @Query(() => Station, { nullable: true })
  async station(
    @Args('provider', { type: () => StationProvider })
    provider: StationProvider,

    @Args('id', { type: () => String })
    id: string,
  ) {
    return this.stationsService.findById(provider, id);
  }
}
