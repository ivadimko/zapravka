import type { NextPage } from 'next';
import Head from 'next/head';
import { Map } from '@/components/Map';

const Home: NextPage = () => (
  <>
    <Head>
      <title>Available fuel</title>
      <meta
        name="description"
        content="Fuel status"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Map />
  </>
);

export default Home;
