import { FuelType } from '@/fuels/fuels.typedefs';
import { MottoFuelType } from '@/stations/motto/motto.typedefs';

export const MottoFuelMapping = {
  [MottoFuelType.M100]: FuelType.Petrol,
  [MottoFuelType.A98]: FuelType.Petrol,
  [MottoFuelType.M95]: FuelType.Petrol,
  [MottoFuelType.A95EKO]: FuelType.Petrol,
  [MottoFuelType.A95]: FuelType.Petrol,
  [MottoFuelType.A92]: FuelType.Petrol92,
  [MottoFuelType.DieselPlus]: FuelType.Diesel,
  [MottoFuelType.Diesel]: FuelType.Diesel,
  [MottoFuelType.Gas]: FuelType.Gas,
};
