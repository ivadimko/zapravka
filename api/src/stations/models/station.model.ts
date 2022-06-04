import { ObjectType } from '@nestjs/graphql';
import { StationFuelStatus } from '@/fuels/fuels.typedefs';
import {
  Coordinates,
  GasStationDescriptionType,
  StationProvider,
  GasStationSchedule,
  StationReference,
} from '@/stations/stations.typedefs';

@ObjectType()
export class Station {
  id: string;
  provider: StationProvider;
  name: string;
  coordinates: Coordinates;
  workDescription: string;
  descriptionType: GasStationDescriptionType;
  status: StationFuelStatus;
  schedule: GasStationSchedule | null;
  scheduleString: string;
  icon: string;
  reference: StationReference;
}
