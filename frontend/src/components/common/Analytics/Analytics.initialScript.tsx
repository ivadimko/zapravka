export const AnalyticsInitialScript = () => (
  <>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-2EHTQRP6HE" />
    <script dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-2EHTQRP6HE');
      `,
    }}
    />
  </>
);
