import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum FuelType {
  Petrol92 = 'petrol_92',
  Petrol = 'petrol',
  Diesel = 'diesel',
  Gas = 'gas',
  AdBlue = 'ad_blue',
}

registerEnumType(FuelType, {
  name: 'FuelType',
});

export enum FuelStatus {
  Empty = 'empty',
  OnlyCriticalVehicles = 'only_critical_vehicles',
  Available = 'available_cash',
  AvailableFuelCards = 'available_fuel_cards',
}

registerEnumType(FuelStatus, {
  name: 'FuelStatus',
});

@ObjectType()
export class FuelStatusesMap {
  @Field(() => Boolean, { nullable: true })
  [FuelStatus.Empty]?: boolean;

  @Field(() => Boolean, { nullable: true })
  [FuelStatus.OnlyCriticalVehicles]?: boolean;

  @Field(() => Boolean, { nullable: true })
  [FuelStatus.Available]?: boolean;

  @Field(() => Boolean, { nullable: true })
  [FuelStatus.AvailableFuelCards]?: boolean;

  @Field(() => Float, { nullable: true })
  price?: number;
}

@ObjectType()
export class StationFuelStatus {
  @Field()
  [FuelType.Petrol92]: FuelStatusesMap;

  @Field()
  [FuelType.Petrol]: FuelStatusesMap;

  @Field()
  [FuelType.Diesel]: FuelStatusesMap;

  @Field()
  [FuelType.Gas]: FuelStatusesMap;

  @Field()
  [FuelType.AdBlue]: FuelStatusesMap;
}

export interface FuelStatusWithPrice {
  status: FuelStatus;
  price: number;
}
