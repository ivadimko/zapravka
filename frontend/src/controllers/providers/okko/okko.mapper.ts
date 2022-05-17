import {
  GasStation,
  GasStationDescriptionType,
  GasStationSchedule,
} from '@/controllers/station/station.typedefs';
import { FuelType } from '@/controllers/fuel/fuel.typedefs';
import {
  makeExternalUtm,
} from '@/controllers/analytics/analytics.utils/makeExternalUtm';
import {
  OkkoFuelType,
  OkkoGasStation,
} from '@/controllers/providers/okko/okko.typedefs';
import { OkkoFuelMapping } from '@/controllers/providers/okko/okko.constants';

const mapFuelStatus = (
  statuses: OkkoGasStation['status'],
): GasStation['status'] => {
  const result: GasStation['status'] = {
    [FuelType.Petrol92]: {},
    [FuelType.Petrol]: {},
    [FuelType.Diesel]: {},
    [FuelType.Gas]: {},
    [FuelType.AdBlue]: {},
  };

  Object.entries(statuses).forEach((entry) => {
    const [fuel, availabilities] = entry;

    const mappedFuel = OkkoFuelMapping[fuel as OkkoFuelType];

    if (!result[mappedFuel]) {
      result[mappedFuel] = {};
    }

    availabilities.forEach(
      (status) => {
        result[mappedFuel][status] = true;
      },
    );
  });

  return result;
};

const mapName = (
  station: OkkoGasStation,
): string => {
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Cod_AZK, Typ_naselenogo_punktu, Naselenyy_punkt, Adresa,
  } = station.attributes;

  return `OKKO ${Cod_AZK} \n ${Typ_naselenogo_punktu} ${Naselenyy_punkt}, ${Adresa}`;
};

const mapSchedule = (schedule?: string): GasStationSchedule | null => {
  if (!schedule) {
    return null;
  }

  if (schedule.toLowerCase().includes('цілодобово')) {
    return {
      opensAt: '00:00',
      closesAt: '23:59',
    };
  }

  const [start, end] = schedule.split(' до ');

  return {
    opensAt: (start || '').replace('з', '').trim(),
    closesAt: (end || '').replace('.', '').trim(),
  };
};

export const okkoMapper = (station: OkkoGasStation): GasStation => ({
  id: `okko_${station.attributes.Cod_AZK}`,
  name: mapName(station),
  coordinates: {
    lat: station.attributes.coordinates.lat,
    lng: station.attributes.coordinates.lng,
  },
  workDescription: station.attributes.notification,
  descriptionType: GasStationDescriptionType.HTML,
  status: mapFuelStatus(station.status),
  schedule: mapSchedule(station.schedule),
  scheduleString: '',
  icon: '/marker/okko.png',
  reference: {
    title: 'okko.ua',
    link: makeExternalUtm('https://www.okko.ua/fuel-map'),
  },
});
