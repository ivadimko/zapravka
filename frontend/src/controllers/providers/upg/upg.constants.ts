import { FuelType } from '@/controllers/fuel/fuel.typedefs';
import { UPGFuelType } from '@/controllers/providers/upg/upg.typedefs';

export const UpgFuelMapping = {
  [UPGFuelType.A92Prepaid]: FuelType.Petrol92,
  [UPGFuelType.A95]: FuelType.Petrol,
  [UPGFuelType.A95Prepaid]: FuelType.Petrol,
  [UPGFuelType.A100]: FuelType.Petrol,
  [UPGFuelType.Diesel]: FuelType.Diesel,
  [UPGFuelType.DieselPrepaid]: FuelType.Diesel,
  [UPGFuelType.Gas]: FuelType.Gas,
};
