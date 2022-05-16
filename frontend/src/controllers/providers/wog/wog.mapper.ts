import {
  WogFuelType,
  WogGasStation, WogSchedule,
} from '@/controllers/providers/wog/wog.typedefs';
import {
  GasStation,
  GasStationSchedule,
} from '@/controllers/station/station.typedefs';
import {
  WogFuelMapping,
  WogFuelStatusMapping,
} from '@/controllers/providers/wog/wog.constants';
import { FuelStatusPriority } from '@/controllers/fuel/fuel.constants';
import { FuelStatus, FuelType } from '@/controllers/fuel/fuel.typedefs';

const mapFuelStatus = (
  statuses: WogGasStation['status'],
): GasStation['status'] => {
  const result: GasStation['status'] = {
    [FuelType.Petrol92]: FuelStatus.Empty,
    [FuelType.Petrol]: FuelStatus.Empty,
    [FuelType.Diesel]: FuelStatus.Empty,
    [FuelType.Gas]: FuelStatus.Empty,
  };

  Object.entries(statuses).forEach((entry) => {
    const [fuel, status] = entry;

    const mappedFuel = WogFuelMapping[fuel as WogFuelType];
    const mappedStatus = WogFuelStatusMapping[status];

    const savedPriority = FuelStatusPriority[result[mappedFuel]];
    const currentPriority = FuelStatusPriority[mappedStatus];

    if (!result[mappedFuel] || savedPriority < currentPriority) {
      result[mappedFuel] = mappedStatus;
    }
  });

  return result;
};

const mapSchedule = (schedule?: WogSchedule): GasStationSchedule | null => {
  if (!schedule) {
    return null;
  }

  const [start, end] = schedule.interval.split(' - ');

  return {
    opensAt: start,
    closesAt: end,
  };
};

const mapScheduleString = (schedule?: WogSchedule): string => {
  if (!schedule) {
    return '';
  }

  return `${schedule.day}: ${schedule.interval}`;
};

export const wogMapper = (station: WogGasStation): GasStation => ({
  id: `wog_${station.id}`,
  name: station.name,
  coordinates: {
    lat: station.coordinates.latitude,
    lng: station.coordinates.longitude,
  },
  workDescription: station.workDescription,
  status: mapFuelStatus(station.status),
  schedule: mapSchedule(station.schedule[0]),
  scheduleString: mapScheduleString(station.schedule[0]),
});
