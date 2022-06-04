import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { Seo } from '@/components/Seo';
import { useApollo } from '@/controllers/graphql/graphql.client';

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <Seo />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
