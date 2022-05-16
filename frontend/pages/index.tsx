import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useMemo } from 'react';
import { Map } from '@/components/Map';

interface Props {
  data: Record<string, any>[]
  revalidated: number
}

const withRetry = async (
  action: () => Promise<any>,
  step = 1,
): Promise<any> => {
  if (step === 3) {
    console.warn(`Failed to fetch after ${step} attempts, return null`);

    return null;
  }

  try {
    const result = await action();

    return result;
  } catch (error) {
    const next = step + 1;

    console.warn(`Couldn't fetch, retry ${next}`);

    return withRetry(action, next);
  }
};

const Home: NextPage<Props> = (props) => {
  const { data, revalidated } = props;

  const updatedAt = useMemo(() => new Date(revalidated).toLocaleDateString('en', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }), [revalidated]);
  return (
    <>
      <Head>
        <title>
          Available fuel
          {' | '}
          {updatedAt}
        </title>
        <meta
          name="description"
          content="Fuel status"
        />
      </Head>

      <Map
        data={data}
        updatedAt={updatedAt}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line global-require
    const data = require('@/data/wog/station-status.json');

    return {
      props: {
        data,
        revalidated: Date.now(),
      },
    };
  }

  const { data } = await withRetry(
    () => fetch('https://api.wog.ua/fuel_stations')
      .then((res) => res.json()),
  );

  const result: Record<string, any>[] = [];

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
    async (promise: Promise<any>, part: Record<string, any>[], i: number) => {
      await promise;

      // eslint-disable-next-line no-console
      console.info(`procesing part ${i + 1}/${parts.length}, ${part.length} items`);

      const temp = await Promise.all(part.map(async (station) => {
        const stationData = await withRetry(() => fetch(station.link)
          .then((response) => response.json()));

        const description = stationData.data.workDescription;

        stationData.data.status = {};

        const rows = description.split('\n');

        rows.forEach((row: string) => {
          const [fuel, status] = row.split(' - ');

          if (fuel && status) {
            stationData.data.status[fuel] = status;
          }
        });

        return stationData;
      }));

      const items = temp.filter((item) => item !== null);

      result.push(...items);
    },
    Promise.resolve(),
  );

  return {
    props: {
      data: result,
      revalidated: Date.now(),
    },
    revalidate: 600,
  };
};

export default Home;
