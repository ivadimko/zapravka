import { FuelType } from '@/fuels/fuels.typedefs';
import { SocarFuelType } from '@/stations/socar/socar.typedefs';

export const SocarFuelMapping = {
  [SocarFuelType.A92]: FuelType.Petrol92,
  [SocarFuelType.A95]: FuelType.Petrol,
  [SocarFuelType.Nano95]: FuelType.Petrol,
  [SocarFuelType.Nano98]: FuelType.Petrol,
  [SocarFuelType.NanoDiesel]: FuelType.Diesel,
  [SocarFuelType.NanoDieselExtra]: FuelType.Diesel,
  [SocarFuelType.LPG]: FuelType.Gas,
  [SocarFuelType.AdBlue]: FuelType.AdBlue,
};
