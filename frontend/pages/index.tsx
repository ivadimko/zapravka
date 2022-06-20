import type { GetStaticProps, NextPage } from 'next';
import { useMemo } from 'react';
import { NextSeo } from 'next-seo';
import { Map } from '@/components/Map';
import MapImage from '@/components/Map/MapImage.jpeg';
import { initializeApollo } from '@/controllers/graphql/graphql.client';
import {
  StationsDocument,
  StationsQuery,
} from '@/controllers/graphql/generated';

interface Props {
  data: string
  revalidated: number
}

const Home: NextPage<Props> = (props) => {
  const { data, revalidated } = props;

  const stations = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));

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
        data={stations}
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

  return {
    props: {
      data: Buffer.from(JSON.stringify(data.stations)).toString('base64'),
      revalidated: Date.now(),
    },
  };
};

export default Home;
