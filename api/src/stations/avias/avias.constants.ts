import { FuelType } from '@/fuels/fuels.typedefs';
import { AviasFuelType } from '@/stations/avias/avias.typedefs';

export const AviasFuelMapping = {
  [AviasFuelType.DieselEnergy]: FuelType.Diesel,
  [AviasFuelType.DieselEuro]: FuelType.Diesel,
  [AviasFuelType.GAS]: FuelType.Gas,
  [AviasFuelType.A92Energy]: FuelType.Petrol92,
  [AviasFuelType.A95]: FuelType.Petrol,
  [AviasFuelType.A95Energy]: FuelType.Petrol,
  [AviasFuelType.A98]: FuelType.Petrol,
};
