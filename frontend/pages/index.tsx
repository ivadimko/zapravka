import type { GetStaticProps, NextPage } from 'next';
import { useMemo } from 'react';
import { NextSeo } from 'next-seo';
import { Map } from '@/components/Map';
import { processWogStations } from '@/controllers/providers/wog/wog.fetcher';
import { GasStation } from '@/controllers/station/station.typedefs';
import {
  processSocarStations,
} from '@/controllers/providers/socar/socar.fetcher';
import { processOkkoStations } from '@/controllers/providers/okko/okko.fetcher';
import MapImage from '@/components/Map/MapImage.png';

interface Props {
  data: Array<GasStation>
  revalidated: number
}

const Home: NextPage<Props> = (props) => {
  const { data, revalidated } = props;

  const updatedAt = useMemo(() => ({
    short: new Date(revalidated).toLocaleDateString('uk', {
      day: 'numeric',
      month: 'long',
    }),
    long: new Date(revalidated).toLocaleDateString('uk', {
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h23',
    }),
  }), [revalidated]);

  const title = `Пальне в наявності на ${updatedAt.short}`;
  const description = 'Де заправитись? Інтерактивна мапа наявності пального на АЗК в Україні. Статус заправок WOG, OKKO, SOCAR.';

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
          url: 'https://zapravka.info',
          images: [
            {
              url: MapImage.src,
              width: MapImage.width,
              height: MapImage.height,
              alt: 'Інтерактивна мапа заправок України',
            },
          ],
        }}
      />

      <Map
        data={data}
        updatedAt={updatedAt.long}
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
