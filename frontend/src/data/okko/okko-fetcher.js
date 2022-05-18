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
  cookie = 'visid_incap_2141272=P7Jrk8XhSgaqdWGB0XfB8skfhWIAAAAAQUIPAAAAAAASxpG3fVnZ6yY2UEzPcfoi; incap_ses_324_2141272=QnWLRr9iPj1Q2IAKmhR/BMkfhWIAAAAASxEGO6oqt71C+kUFJReBiw==',
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
    console.info(`time: ${new Date().toLocaleString()}, statusCode: ${res.statusCode}`);

    // console.info(res.headers);

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
      if (res.statusCode === 200) {
        resolve(JSON.parse(body));
      } else {
        reject(new Error(res.statusCode));
      }
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
