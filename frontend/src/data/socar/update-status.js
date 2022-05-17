const fs = require('fs/promises');
const fetch = require('node-fetch');

(async () => {
  const API_ENDPOINT = 'https://socar.ua/api/map/stations?region=&services=';

  const { data } = await fetch(API_ENDPOINT)
    .then((res) => res.json());

  const result = data.map((station) => {
    const status = {};

    const { fuelPrices } = station.attributes;

    fuelPrices.forEach((row) => {
      const priceStartIndex = row.indexOf(' (');

      const fuel = row.substring(0, priceStartIndex);

      status[fuel] = 'available_cash';
    });

    return ({
      ...station,
      status,
    });
  });

  await fs.writeFile('station-status.json', JSON.stringify(result, null, 2));
})();
