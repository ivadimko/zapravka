const fs = require('fs/promises');
const parser = require('node-html-parser');
const fetch = require('node-fetch');

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

(async () => {
  const response = await fetch('https://www.okko.ua/api/uk/fuel-map', {
    headers: {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-language': 'uk',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      cookie: 'visid_incap_2141272=hnr24SnWSpu+aI4qVFoMOprOhGIAAAAAQUIPAAAAAAC6MSNwgrJNIOMeAxnZynAE; incap_ses_1104_2141272=PLeeBQso+GxCEixBzjJSD5rOhGIAAAAAkopA3mCBS01MLn4yZ4MPpQ==',
    },
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
  })
    .then((res) => res.json());

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
