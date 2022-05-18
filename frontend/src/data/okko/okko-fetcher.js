const https = require('https');

const parseCookie = (cookieArray, oldCookie) => {
  const cookieString = cookieArray.map((element) => {
    const [cookie] = element.split(';');

    return cookie;
  })
    .join('; ');

  if (oldCookie) {
    return [cookieString, oldCookie].join('; ');
  }

  return cookieString;
};

const fetch = async (
  cookie = 'visid_incap_2141272=QXrP7fZMQA+AeDoMCVScrb/DhGIAAAAAQUIPAAAAAAD9Mfy80j6nI/qNn5NnJytD; incap_ses_324_2141272=us22ILeHwnpl6ngKmhR/BNwHhWIAAAAAlM2EnyhdMRM6FL789dUf5g==',
  attempt = 1,
) => new Promise((resolve, reject) => {
  if (attempt === 10) {
    reject(new Error('Too much requests, throw error'));
  }

  const options = {
    hostname: 'www.okko.ua',
    port: 443,
    path: '/api/uk/fuel-map',
    method: 'GET',
    insecureHTTPParser: true,
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
      ...(cookie ? { cookie } : {}),
    },
  };

  const req = https.request({
    ...options,
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
      resolve(JSON.parse(body));
    });
  });

  req.on('error', (error) => {
    console.error(error);
    reject(error);
  });

  req.end();
});

module.exports = {
  fetchOkkoData: fetch,
};
