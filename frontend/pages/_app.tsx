import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { useEffect } from 'react';
import { Seo } from '@/components/Seo';
import { useApollo } from '@/controllers/graphql/graphql.client';
import {
  amplitudeClient,
} from '@/controllers/analytics/amplitude/amplitude.client';

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);

  useEffect(() => {
    amplitudeClient.initInstance();
  }, []);

  return (
    <ApolloProvider client={apolloClient}>
      <Seo />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
