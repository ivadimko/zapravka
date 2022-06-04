import { withRetry } from '@/utils/withRetry';
import {
  WogFuel, WogFuelType,
  WogGasStation, WogGasStationShort,
  WogService,
} from '@/controllers/providers/wog/wog.typedefs';
import { wogMapper } from '@/controllers/providers/wog/wog.mapper';

interface AllStationsApiResponse {
  data: {
    service_filters: Array<WogService>
    fuel_filters: Array<WogFuel>
    applied_service_filters: Array<WogService>
    applied_fuel_filters: Array<WogFuel>
    stations: Array<WogGasStationShort>
  }
}

interface SingleStationApiResponse {
  data: WogGasStation
}

export const fetchWogStations = async () => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line global-require
    const stations: Array<SingleStationApiResponse> = require('../../../../../api-old/src/data/wog/station-status.json');

    return stations.map((station) => station.data);
  }

  const API_ENDPOINT = 'https://api.wog.ua/fuel_stations';

  const { data } = await withRetry<AllStationsApiResponse>(
    () => fetch(API_ENDPOINT)
      .then((res) => res.json()),
  );

  const result: Array<WogGasStation> = [];

  const parts = [];

  let start = 0;

  const STEP = 100;

  while (start < data.stations.length) {
    const end = Math.min(start + STEP, data.stations.length);

    const part = data.stations.slice(start, end);

    parts.push(part);

    start = end;
  }

  await parts.reduce(
    async (
      promise: Promise<any>,
      part: Array<WogGasStationShort>,
      i: number,
    ) => {
      await promise;

      // eslint-disable-next-line no-console
      console.info(`procesing part ${i + 1}/${parts.length}, ${part.length} items`);

      const temp = await Promise.all(part.map(async (station) => {
        const stationData = await withRetry<SingleStationApiResponse>(
          () => {
            console.info('WOG: START');

            return fetch(station.link)
              .then((response) => {
                console.info('WOG: updated from endpoint');
                return response.json();
              });
          },
        );

        const description = stationData.data.workDescription;

        stationData.data.status = {} as Record<WogFuelType, string>;

        const rows = description.split('\n');

        rows.forEach((row: string) => {
          const [fuel, status] = row.split(' - ');

          if (fuel && status) {
            stationData.data.status[fuel as WogFuelType] = status;
          }
        });

        return stationData.data;
      }));

      result.push(...temp);
    },
    Promise.resolve(),
  );

  return result;
};

export const processWogStations = async () => {
  console.info('Fetch WOG stations: START');
  const stations = await fetchWogStations();

  return stations.map(wogMapper);
};
