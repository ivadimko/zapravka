import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useMemo } from 'react';
import { Map } from '@/components/Map';
import { processWogStations } from '@/controllers/providers/wog/wog.fetcher';
import { GasStation } from '@/controllers/station/station.typedefs';
import {
  processSocarStations,
} from '@/controllers/providers/socar/socar.fetcher';
import { processOkkoStations } from '@/controllers/providers/okko/okko.fetcher';

interface Props {
  data: Array<GasStation>
  revalidated: number
}

const Home: NextPage<Props> = (props) => {
  const { data, revalidated } = props;

  const updatedAt = useMemo(() => new Date(revalidated).toLocaleDateString('uk', {
    day: 'numeric',
    month: 'long',
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
  const [
    wogStations,
    socarStations,
    okkoStations,
  ] = await Promise.all([
    processWogStations(),
    processSocarStations(),
    processOkkoStations(),
  ]);

  return {
    props: {
      data: [
        ...wogStations,
        ...socarStations,
        ...okkoStations,
      ],
      revalidated: Date.now(),
    },
  };
};

export default Home;
