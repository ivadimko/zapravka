import { Field, ObjectType } from '@nestjs/graphql';
import { StationFuelStatus } from '@/fuels/fuels.typedefs';
import {
  Coordinates,
  GasStationDescriptionType,
  GasStationSchedule,
  StationReference,
} from '@/stations/stations.typedefs';

@ObjectType()
export class Station {
  id: string;
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
