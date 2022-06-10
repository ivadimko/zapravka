import { FuelType } from '@/fuels/fuels.typedefs';
import { BRSMFuelType } from '@/stations/brsm/brsm.typedefs';

export const BRSMFuelMapping = {
  [BRSMFuelType.A92Euro]: FuelType.Petrol92,
  [BRSMFuelType.A95Euro]: FuelType.Petrol,
  [BRSMFuelType.A95Premium]: FuelType.Petrol,
  [BRSMFuelType.DPEuroPlus]: FuelType.Diesel,
  [BRSMFuelType.LPGPlus]: FuelType.Gas,
};
