import type { GetStaticProps, NextPage } from 'next';
import { useMemo } from 'react';
import { NextSeo } from 'next-seo';
import cloneDeep from 'lodash/cloneDeep';
import { Map } from '@/components/Map';
import MapImage from '@/components/Map/MapImage.jpeg';
import { initializeApollo } from '@/controllers/graphql/graphql.client';
import {
  StationFragment,
  StationsDocument,
  StationsQuery,
} from '@/controllers/graphql/generated';

interface Props {
  data: Array<StationFragment>
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

  const title = 'Пальне в наявності сьогодні';
  const description = 'Де заправитись? Інтерактивна мапа наявності пального на АЗК в Україні. Статус заправок WOG, OKKO, SOCAR, UPG, АВІАС ПЛЮС, АВІАС, ANP, Sentosa Oіl, МАВЕКС, УКРТАТНАФТА, ЮКОН, ЭЛИН, ЮКОН Сервіс, Rubіx, МАВЕКС плюс, Петрол Гарант, ЗНП, БРСМ Нафта.';

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
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query<StationsQuery>({
    query: StationsDocument,
  });

  const result: Array<StationFragment> = cloneDeep(data.stations);

  result.forEach((station) => {
    Object.values((station.status)).forEach((fuel) => {
      Object.entries(fuel).forEach(([name, status]) => {
        if (!status) {
          // @ts-ignore
          // eslint-disable-next-line no-param-reassign
          delete fuel[name];
        }
      });
    });
  });

  return {
    props: {
      data: result,
      revalidated: Date.now(),
    },
  };
};

export default Home;
