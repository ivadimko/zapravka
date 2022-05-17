import { GasStation } from '@/controllers/station/station.typedefs';
import { FuelStatusPriority } from '@/controllers/fuel/fuel.constants';
import { FuelStatus, FuelType } from '@/controllers/fuel/fuel.typedefs';
import {
  SocarFuelType,
  SocarGasStation,
} from '@/controllers/providers/socar/socar.typedefs';
import { SocarFuelMapping } from '@/controllers/providers/socar/socar.constants';
import {
  makeExternalUtm,
} from '@/controllers/analytics/analytics.utils/makeExternalUtm';

const mapFuelStatus = (
  statuses: SocarGasStation['status'],
): GasStation['status'] => {
  const result: GasStation['status'] = {
    [FuelType.Petrol92]: FuelStatus.Empty,
    [FuelType.Petrol]: FuelStatus.Empty,
    [FuelType.Diesel]: FuelStatus.Empty,
    [FuelType.Gas]: FuelStatus.Empty,
    [FuelType.AdBlue]: FuelStatus.Empty,
  };

  Object.entries(statuses).forEach((entry) => {
    const [fuel, status] = entry;

    const mappedFuel = SocarFuelMapping[fuel as SocarFuelType];
    const mappedStatus = status;

    const savedPriority = FuelStatusPriority[result[mappedFuel]];
    const currentPriority = FuelStatusPriority[mappedStatus];

    if (!result[mappedFuel] || savedPriority < currentPriority) {
      result[mappedFuel] = mappedStatus;
    }
  });

  return result;
};

const mapWorkDescription = (station: SocarGasStation): string => {
  const fuels = `
    Доступне пальне:
    - ${station.attributes.fuelPrices.join(',\n')}
  `;

  return fuels;
};

const mapName = (
  station: SocarGasStation,
): string => `${station.attributes.title} \n ${station.attributes.address}`;

export const socarMapper = (station: SocarGasStation): GasStation => ({
  id: `socar_${station.id}`,
  name: mapName(station),
  coordinates: {
    lat: station.attributes.marker.lat,
    lng: station.attributes.marker.lng,
  },
  workDescription: mapWorkDescription(station),
  status: mapFuelStatus(station.status),
  schedule: null,
  scheduleString: '',
  icon: '/marker/socar.svg',
  reference: {
    title: 'socar.ua',
    link: makeExternalUtm('https://socar.ua/map'),
  },
});
