const https = require('https');

const parseCookie = (cookieArray) => cookieArray.map((element) => {
  const [cookie] = element.split(';');

  return cookie;
})
  .join('; ');

const fetch = async (cookies, attempt = 1) => new Promise((resolve, reject) => {
  const options = {
    hostname: 'www.okko.ua',
    port: 443,
    path: '/api/uk/fuel-map',
    method: 'GET',
    insecureHTTPParser: true,
    headers: {
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/adsbot.html)',
      ...(cookies ? { cookies } : {}),
    },
  };

  const req = https.request({
    ...options,
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/adsbot.html)',
  }, (res) => {
    console.info(`statusCode: ${res.statusCode}`);

    console.info(res.headers);

    res.setEncoding('utf-8');

    if (res.statusCode === 302) {
      const parsedCookies = parseCookie(res.headers['set-cookie']);

      resolve(fetch(parsedCookies, attempt + 1));
      return;
    }

    let body = '';

    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', () => {
      console.info(`RES ${attempt}`, JSON.parse(body));
      resolve(body);
    });
  });

  req.on('error', (error) => {
    console.error(error);
    reject(error);
  });

  req.end();
});

(async () => {
  await fetch();
})();
