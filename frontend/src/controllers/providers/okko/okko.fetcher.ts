import { Node, parse } from 'node-html-parser';
import { withRetry } from '@/utils/withRetry';
import { FuelStatus } from '@/controllers/fuel/fuel.typedefs';
import {
  OkkoFuelType,
  OkkoGasStation,
} from '@/controllers/providers/okko/okko.typedefs';
import { okkoMapper } from '@/controllers/providers/okko/okko.mapper';

interface AllStationsApiResponse {
  data: {
    layout: Array<{
      data: {
        list: {
          collection: Array<OkkoGasStation>
        }
      }
    }>
  }
}

const SCHEDULE = 'Графік роботи:';
const AVAILABLE_CASH = 'За готівку і банківські картки доступно:';
const AVAILABLE_FUEL_CARDS = 'З паливною карткою і талонами доступно:';

const parseFuel = (options: {
  node: Node,
  status: OkkoGasStation['status'],
  type: FuelStatus
}) => {
  const { node, status, type } = options;

  node.childNodes.forEach((child) => {
    const [fuel] = (child?.textContent || '').split(':') as [OkkoFuelType, string];

    if (!status[fuel]) {
      status[fuel] = [];
    }

    status[fuel].push(type);
  });
};

const parseSchedule = (content: string) => (content.split(SCHEDULE).pop() || '').trim();

export const fetchOkkoStations = async () => {
  // eslint-disable-next-line global-require
  const fallback: Array<OkkoGasStation> = require('@/data/okko/station-status.json');

  if (process.env.NODE_ENV === 'development') {
    return fallback;
  }

  let response: AllStationsApiResponse;

  try {
    console.info(`OKKO: ${process.env.OKKO_ENDPOINT}`);

    response = await withRetry<AllStationsApiResponse>(
      () => {
        console.info('OKKO: START');

        return fetch(process.env.OKKO_ENDPOINT as string)
          .then((res) => {
            console.info('OKKO: updated from endpoint');

            return res.json();
          });
      },
    );
  } catch (error) {
    console.info(error);

    console.info('use fallback');

    response = {
      data: {
        layout: [
          {
            data: {
              list: {
                collection: fallback,
              },
            },
          },
        ],
      },
    };
  }

  const stations = response.data.layout[0].data.list.collection;

  const result = stations.map((station) => {
    let schedule = '';
    const status: OkkoGasStation['status'] = {
      [OkkoFuelType.A92]: [],
      [OkkoFuelType.A95]: [],
      [OkkoFuelType.Pulls95]: [],
      [OkkoFuelType.Diesel]: [],
      [OkkoFuelType.PullsDiesel]: [],
      [OkkoFuelType.Gas]: [],
    };

    const root = parse(station.attributes.notification.replaceAll('\n', ''));

    root.childNodes.forEach((node) => {
      const content = node.textContent;

      if (content.includes(SCHEDULE)) {
        schedule = parseSchedule(content);
      } else if (content.includes(AVAILABLE_CASH)) {
        parseFuel({
          // @ts-ignore
          node: node.nextElementSibling,
          status,
          type: FuelStatus.Available,
        });
      } else if (content.includes(AVAILABLE_FUEL_CARDS)) {
        parseFuel({
          // @ts-ignore
          node: node.nextElementSibling,
          status,
          type: FuelStatus.AvailableFuelCards,
        });
      }
    });

    return {
      ...station,
      schedule,
      status,
    };
  });

  return result;
};

export const processOkkoStations = async () => {
  console.info('Fetch OKKO stations: START');
  const stations = await fetchOkkoStations();

  return stations.map(okkoMapper);
};