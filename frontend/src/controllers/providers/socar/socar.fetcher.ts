import { withRetry } from '@/utils/withRetry';
import {
  SocarFuelType,
  SocarGasStation,
} from '@/controllers/providers/socar/socar.typedefs';
import { FuelStatus } from '@/controllers/fuel/fuel.typedefs';
import { socarMapper } from '@/controllers/providers/socar/socar.mapper';

interface AllStationsApiResponse {
  data: Array<SocarGasStation>
}

export const fetchSocarStations = async () => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line global-require
    const stations: AllStationsApiResponse['data'] = require('../../../../../api/src/data/socar/station-status.json');

    return stations;
  }

  const API_ENDPOINT = 'https://socar.ua/api/map/stations?region=&services=';

  const { data } = await withRetry<AllStationsApiResponse>(
    () => {
      console.info('SOCAR: START');

      return fetch(API_ENDPOINT)
        .then((res) => {
          console.info('SOCAR: updated from endpoint');
          return res.json();
        });
    },
  );

  return data.map((station) => {
    const status = {} as Record<SocarFuelType, FuelStatus>;

    const { fuelPrices } = station.attributes;

    fuelPrices.forEach((row) => {
      const priceStartIndex = row.indexOf(' (');

      const fuel = row.substring(0, priceStartIndex);

      status[fuel as SocarFuelType] = FuelStatus.Available;
    });

    return ({
      ...station,
      status,
    });
  });
};

export const processSocarStations = async () => {
  console.info('Fetch SOCAR stations: START');
  const stations = await fetchSocarStations();

  return stations.map(socarMapper);
};
