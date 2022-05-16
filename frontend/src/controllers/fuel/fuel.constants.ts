import { FuelStatus } from '@/controllers/fuel/fuel.typedefs';

export const FuelStatusPriority = {
  [FuelStatus.Empty]: 0,
  [FuelStatus.OnlyCriticalVehicles]: 1,
  [FuelStatus.AvailableFuelCards]: 2,
  [FuelStatus.Available]: 3,
};
