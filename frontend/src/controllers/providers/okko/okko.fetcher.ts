import { Node, parse } from 'node-html-parser';
import https from 'https';
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

const parseCookie = (cookieArray: string[]): string => cookieArray
  .map((element) => {
    const [cookie] = element.split(';');

    return cookie;
  })
  .join('; ');

const fetchData = async (
  cookies?: string,
  attempt = 1,
): Promise<AllStationsApiResponse> => new Promise((resolve, reject) => {
  const options = {
    hostname: 'www.okko.ua',
    port: 443,
    path: '/api/uk/fuel-map',
    method: 'GET',
    insecureHTTPParser: true,
    headers: {
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/adsbot.html)',
      ...(cookies ? { cookies } : {}),
    },
  };

  const req = https.request({
    ...options,
    // @ts-ignore
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/adsbot.html)',
  }, (res) => {
    console.info(`RES ${attempt} STARTED`);
    console.info(`statusCode: ${res.statusCode}`);

    console.info(res.headers);

    res.setEncoding('utf-8');

    if (res.statusCode === 302) {
      const parsedCookies = parseCookie(res.headers['set-cookie'] as string[]);

      resolve(fetchData(parsedCookies, attempt + 1));
      return;
    }

    let body = '';

    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', () => {
      console.info(`RES ${attempt} FINISHED`);
      resolve(JSON.parse(body));
    });
  });

  req.on('error', (error) => {
    console.error(error);
    reject(error);
  });

  req.end();
});

export const fetchOkkoStations = async () => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line global-require
    const stations: Array<OkkoGasStation> = require('@/data/okko/station-status.json');

    return stations;
  }

  const response = await withRetry<AllStationsApiResponse>(
    () => fetchData(),
  );

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
          node: node.nextSibling,
          status,
          type: FuelStatus.Available,
        });
      } else if (content.includes(AVAILABLE_FUEL_CARDS)) {
        parseFuel({
          // @ts-ignore
          node: node.nextSibling,
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
