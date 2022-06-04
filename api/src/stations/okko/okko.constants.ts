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
