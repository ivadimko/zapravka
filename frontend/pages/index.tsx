import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useMemo } from 'react';
import { Map } from '@/components/Map';

interface Props {
  data: Record<string, any>[]
  revalidated: number
}
const Home: NextPage<Props> = (props) => {
  const { data, revalidated } = props;

  const updatedAt = useMemo(() => new Date(revalidated).toLocaleDateString('en', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h24',
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
        <link rel="icon" href="/favicon.ico" />
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

  const { data } = await fetch('https://api.wog.ua/fuel_stations')
    .then((res) => res.json());

  const result: Record<string, any>[] = [];

  await data.stations.reduce(
    async (promise: Promise<any>, station: Record<string, any>, i: number) => {
      await promise;

      // eslint-disable-next-line no-console
      console.info(`procesing station ${i + 1}/${data.stations.length}`, station.name);

      const stationData = await fetch(station.link)
        .then((response) => response.json());

      const description = stationData.data.workDescription;

      stationData.data.status = {};

      const rows = description.split('\n');

      rows.forEach((row: string) => {
        const [fuel, status] = row.split(' - ');

        if (fuel && status) {
          stationData.data.status[fuel] = status;
        }
      });

      result.push(stationData);
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
