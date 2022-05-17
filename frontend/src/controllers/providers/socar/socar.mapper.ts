import {
  GasStation,
  GasStationDescriptionType,
} from '@/controllers/station/station.typedefs';
import { FuelType } from '@/controllers/fuel/fuel.typedefs';
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
    [FuelType.Petrol92]: {},
    [FuelType.Petrol]: {},
    [FuelType.Diesel]: {},
    [FuelType.Gas]: {},
    [FuelType.AdBlue]: {},
  };

  Object.entries(statuses).forEach((entry) => {
    const [fuel, status] = entry;

    const mappedFuel = SocarFuelMapping[fuel as SocarFuelType];
    const mappedStatus = status;

    if (!result[mappedFuel]) {
      result[mappedFuel] = {};
    }

    result[mappedFuel][mappedStatus] = true;
  });

  return result;
};

const mapWorkDescription = (station: SocarGasStation): string => {
  const fuels = `
    <strong>Доступне пальне:</strong>
    <ul>
        ${station.attributes.fuelPrices.map((el) => `<li>${el}</li>`)}
    </ul>
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
  descriptionType: GasStationDescriptionType.HTML,
  status: mapFuelStatus(station.status),
  schedule: null,
  scheduleString: '',
  icon: '/marker/socar.svg',
  reference: {
    title: 'socar.ua',
    link: makeExternalUtm('https://socar.ua/map'),
  },
});
