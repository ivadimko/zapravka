import { NextSeo } from 'next-seo';

export const Seo = () => (
  <NextSeo
    titleTemplate="%s - zapravka.info"
    openGraph={{
      locale: 'uk_UA',
      site_name: 'zapravka.info',
      url: 'https://zapravka.info',
    }}
  />
);
