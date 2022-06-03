import {
  WogFuelStatus,
  WogFuelType,
  WogGasStation,
  WogSchedule,
} from '@/controllers/providers/wog/wog.typedefs';
import {
  GasStation,
  GasStationDescriptionType,
  GasStationSchedule,
} from '@/controllers/station/station.typedefs';
import { WogFuelMapping } from '@/controllers/providers/wog/wog.constants';
import { FuelStatus, FuelType } from '@/controllers/fuel/fuel.typedefs';
import {
  makeExternalUtm,
} from '@/controllers/analytics/analytics.utils/makeExternalUtm';

const resolveFuelStatus = (wogStatus: string): FuelStatus => {
  const normalizedStatus = wogStatus.toLowerCase();

  if (normalizedStatus.startsWith(WogFuelStatus.Available)) {
    return FuelStatus.Available;
  }

  if (normalizedStatus.startsWith(WogFuelStatus.AvailableFuelCards)) {
    return FuelStatus.AvailableFuelCards;
  }

  if (normalizedStatus.startsWith(WogFuelStatus.OnlyCriticalVehicles)) {
    return FuelStatus.OnlyCriticalVehicles;
  }

  return FuelStatus.Empty;
};

const mapFuelStatus = (
  statuses: WogGasStation['status'],
): GasStation['status'] => {
  const result: GasStation['status'] = {
    [FuelType.Petrol92]: {},
    [FuelType.Petrol]: {},
    [FuelType.Diesel]: {},
    [FuelType.Gas]: {},
    [FuelType.AdBlue]: {},
  };

  Object.entries(statuses).forEach((entry) => {
    const [fuel, status] = entry;

    const mappedFuel = WogFuelMapping[fuel as WogFuelType];
    const mappedStatus = resolveFuelStatus(status);

    if (!result[mappedFuel]) {
      result[mappedFuel] = {};
    }

    result[mappedFuel][mappedStatus] = true;
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

const mapName = (
  station: WogGasStation,
): string => `WOG ${station.id} \n ${station.name}`;

export const wogMapper = (station: WogGasStation): GasStation => ({
  id: `wog_${station.id}`,
  name: mapName(station),
  coordinates: {
    lat: station.coordinates.latitude,
    lng: station.coordinates.longitude,
  },
  workDescription: station.workDescription,
  descriptionType: GasStationDescriptionType.Raw,
  status: mapFuelStatus(station.status),
  schedule: mapSchedule(station.schedule[0]),
  scheduleString: mapScheduleString(station.schedule[0]),
  icon: '/marker/wog.svg',
  reference: {
    title: 'wog.ua',
    link: makeExternalUtm('https://wog.ua/ua/map/'),
  },
});
