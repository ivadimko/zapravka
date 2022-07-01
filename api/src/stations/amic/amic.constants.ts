import { FuelType } from '@/fuels/fuels.typedefs';
import { AmicFuelType } from '@/stations/amic/amic.typedefs';

export const AmicFuelMapping = {
  [AmicFuelType.A92]: FuelType.Petrol92,
  [AmicFuelType.A95]: FuelType.Petrol,
  [AmicFuelType.Diesel]: FuelType.Diesel,
  [AmicFuelType.Gas]: FuelType.Gas,
  [AmicFuelType.AdBlue]: FuelType.AdBlue,
};

export const AmicFuelNames = {
  [AmicFuelType.A92]: 'A-92',
  [AmicFuelType.A95]: 'A-95',
  [AmicFuelType.Diesel]: 'Дизель',
  [AmicFuelType.Gas]: 'Газ',
  [AmicFuelType.AdBlue]: 'AdBlue',
};
