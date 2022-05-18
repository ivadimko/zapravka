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
      cookie: 'visid_incap_2141272=7tJTK0AoRjyJX2ZNwbu56u1rhGIAAAAAQUIPAAAAAACeDRmk1Qca1yiJc1gxIwNm; incap_ses_324_2141272=fmXrVMHQ2GMVik0KmhR/BO5rhGIAAAAAfDH6CyPVI6vNiHXiWtY3ag==',
    },
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
