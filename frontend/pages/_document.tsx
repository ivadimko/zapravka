import {
  Html, Head, Main, NextScript,
} from 'next/document';
import { AnalyticsInitialScript } from '@/components/common/Analytics';

export default function Document() {
  return (
    <Html lang="uk">
      <Head>
        {process.env.NODE_ENV === 'production' && (
          <AnalyticsInitialScript />
        )}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
