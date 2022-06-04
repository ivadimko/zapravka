import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

@ObjectType()
export class GasStationSchedule {
  @Field()
  opensAt: string; // 08:00

  @Field()
  closesAt: string; // 23:50
}

@ObjectType()
export class Coordinates {
  @Field()
  lng: number;

  @Field()
  lat: number;
}

@ObjectType()
export class StationReference {
  @Field()
  title: string;

  @Field()
  link: string;
}

export enum GasStationDescriptionType {
  Raw = 'RAW',
  HTML = 'HTML',
}

registerEnumType(GasStationDescriptionType, {
  name: 'GasStationDescriptionType',
});

export enum StationStatus {
  Opened = 'OPENED',
  Closed = 'CLOSED',
  Unknown = 'UNKNOWN',
}

registerEnumType(StationStatus, {
  name: 'StationStatus',
});
