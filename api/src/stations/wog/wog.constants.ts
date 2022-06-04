import { FuelType } from '@/fuels/fuels.typedefs';
import { WogFuelType } from '@/stations/wog/wog.typedefs';

export const WogFuelMapping = {
  [WogFuelType.A92]: FuelType.Petrol92,
  [WogFuelType.A95]: FuelType.Petrol,
  [WogFuelType.Mustang95]: FuelType.Petrol,
  [WogFuelType.A98]: FuelType.Petrol,
  [WogFuelType.Mustang100]: FuelType.Petrol,
  [WogFuelType.Diesel]: FuelType.Diesel,
  [WogFuelType.MustangDiesel]: FuelType.Diesel,
  [WogFuelType.MustangDieselPlus]: FuelType.Diesel,
  [WogFuelType.Gas]: FuelType.Gas,
};
