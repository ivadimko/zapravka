import { FuelType } from '@/fuels/fuels.typedefs';
import { OkkoFuelType } from '@/stations/okko/okko.typedefs';

export const OkkoFuelMapping = {
  [OkkoFuelType.A92]: FuelType.Petrol92,
  [OkkoFuelType.A95]: FuelType.Petrol,
  [OkkoFuelType.Pulls95]: FuelType.Petrol,
  [OkkoFuelType.Diesel]: FuelType.Diesel,
  [OkkoFuelType.PullsDiesel]: FuelType.Diesel,
  [OkkoFuelType.Gas]: FuelType.Gas,
};

export const OkkoFuelNames = {
  [OkkoFuelType.A92]: 'A-92',
  [OkkoFuelType.A95]: 'A-95',
  [OkkoFuelType.Pulls95]: 'PULLS 95',
  [OkkoFuelType.Diesel]: 'ДП',
  [OkkoFuelType.PullsDiesel]: 'PULLS Diesel',
  [OkkoFuelType.Gas]: 'ГАЗ',
};
