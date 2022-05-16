import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useMemo } from 'react';
import { Map } from '@/components/Map';
import { processWogStations } from '@/controllers/providers/wog/wog.fetcher';
import { GasStation } from '@/controllers/station/station.typedefs';

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
  ] = await Promise.all([
    processWogStations(),
  ]);

  return {
    props: {
      data: [
        ...wogStations,
      ],
      revalidated: Date.now(),
    },
    revalidate: 600,
  };
};

export default Home;
