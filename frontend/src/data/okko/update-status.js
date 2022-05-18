const fs = require('fs/promises');
const parser = require('node-html-parser');
const https = require('https');

const SCHEDULE = 'Графік роботи:';
const AVAILABLE_CASH = 'За готівку і банківські картки доступно:';
const AVAILABLE_FUEL_CARDS = 'З паливною карткою і талонами доступно:';

const parseFuel = (options) => {
  const { node, status, type } = options;

  node.childNodes.forEach((child) => {
    const [fuel] = child.textContent.split(':');

    if (!status[fuel]) {
      status[fuel] = [];
    }

    status[fuel].push(type);
  });
};

const parseSchedule = (content) => (content.split(SCHEDULE).pop() || '').trim();

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

const fetch = async (cookies, attempt = 1) => new Promise((resolve, reject) => {
  const options = {
    referrerPolicy: 'strict-origin-when-cross-origin',
    hostname: 'www.okko.ua',
    port: 443,
    path: '/api/uk/fuel-map/',
    method: 'GET',
    insecureHTTPParser: true,
    headers: {
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/adsbot.html)',
      ...(cookies ? { cookie: cookies } : {}),
    },
  };

  const req = https.request(options, (res) => {
    console.info(`RES ${attempt} STARTED`);
    console.info(`statusCode: ${res.statusCode}`);

    console.info(res.headers);

    res.setEncoding('utf-8');

    if (res.statusCode === 302) {
      const parsedCookies = parseCookie(res.headers['set-cookie'], cookies);

      resolve(fetch(parsedCookies, attempt + 1));
      return;
    }

    let body = '';

    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', () => {
      console.info(`RES ${attempt} FINISHED`);
      resolve(JSON.parse(body));
    });
  });

  req.on('error', (error) => {
    console.error(error);
    reject(error);
  });

  req.end();
});

(async () => {
  const response = await fetch();

  const stations = response.data.layout[0].data.list.collection;

  const result = stations.map((station) => {
    let schedule = '';
    const status = {};

    const root = parser.parse(station.attributes.notification.replaceAll('\n', ''));

    root.childNodes.forEach((node) => {
      const content = node.textContent;

      if (content.includes(SCHEDULE)) {
        schedule = parseSchedule(content);
      } else if (content.includes(AVAILABLE_CASH)) {
        parseFuel({
          node: node.nextSibling,
          status,
          type: 'available_cash',
        });
      } else if (content.includes(AVAILABLE_FUEL_CARDS)) {
        parseFuel({
          node: node.nextSibling,
          status,
          type: 'available_fuel_cards',
        });
      }
    });

    return {
      ...station,
      schedule,
      status,
    };
  })
    .sort((a, b) => a.attributes.Cod_AZK - b.attributes.Cod_AZK);

  await fs.writeFile('station-status.json', JSON.stringify(result, null, 2));
})();
