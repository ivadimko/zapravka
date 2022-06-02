import { withRetry } from '@/utils/withRetry';
import { UPGGasStation } from '@/controllers/providers/upg/upg.typedefs';
import { upgMapper } from '@/controllers/providers/upg/upg.mapper';

interface AllStationsApiResponse {
  data: Array<UPGGasStation>
}

export const fetchUpgStations = async () => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line global-require
    const stations: AllStationsApiResponse = require('@/data/upg/upg-stations.json');

    return stations.data;
  }

  const API_ENDPOINT = `${process.env.API_ENDPOINT}/upg-stations`;

  console.info(`UPG: ${API_ENDPOINT}`);

  const { data } = await withRetry<AllStationsApiResponse>(
    () => {
      console.info('UPG: START');

      return fetch(API_ENDPOINT)
        .then((res) => {
          console.info('UPG: updated from endpoint');
          return res.json();
        });
    },
  );

  return data;
};

export const processUPGStations = async () => {
  console.info('Fetch UPG stations: START');
  const stations = await fetchUpgStations();

  return stations.map(upgMapper);
};
