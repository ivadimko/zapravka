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
      'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,uk;q=0.6,la;q=0.5',
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
      cookie: '_gcl_au=1.1.602557681.1652799618; _ga=GA1.2.732797486.1652799619; _gid=GA1.2.392139137.1652799619; visid_incap_2141272=W25emqN+RnapANLl09S/58m3g2IAAAAAQ0IPAAAAAACUeef0uNJdYuZ3OmrwHVGg; incap_ses_324_2141272=fWbOWFtk6xuKYjwKmhR/BEbug2IAAAAAAEb45aXKdVLehVW2Dk3MLA==; homeBanerSlide=2',
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
  });

  await fs.writeFile('station-status.json', JSON.stringify(result, null, 2));
})();
