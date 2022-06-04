const fs = require('fs/promises');

const { data } = require('./station-status.json');
const descriptions = require('./descriptions.json');

const result = {
  fuels: descriptions.fuels,
  statuses: descriptions.statuses,
};

(async () => {
  data.forEach((station) => {
    const { fuelPrices } = station.attributes;

    fuelPrices.forEach((row) => {
      const priceStartIndex = row.indexOf(' (');

      const fuel = row.substring(0, priceStartIndex);

      result.fuels[fuel] = descriptions.fuels[fuel] ?? true;
    });
  });

  await fs.writeFile('descriptions.json', JSON.stringify(result, null, 2));
})();
