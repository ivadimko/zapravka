import { FuelType } from '@/fuels/fuels.typedefs';
import { UPGFuelType } from '@/stations/upg/upg.typedefs';

export const UpgFuelMapping = {
  [UPGFuelType.A92]: FuelType.Petrol92,
  [UPGFuelType.A92Prepaid]: FuelType.Petrol92,
  [UPGFuelType.UPG95]: FuelType.Petrol,
  [UPGFuelType.A95Prepaid]: FuelType.Petrol,
  [UPGFuelType.A95]: FuelType.Petrol,
  [UPGFuelType.A100]: FuelType.Petrol,
  [UPGFuelType.Diesel]: FuelType.Diesel,
  [UPGFuelType.DieselUpg]: FuelType.Diesel,
  [UPGFuelType.DieselPrepaid]: FuelType.Diesel,
  [UPGFuelType.DieselArctic]: FuelType.Diesel,
  [UPGFuelType.Gas]: FuelType.Gas,
};
