const fs = require('fs/promises');

const data = require('./station-status.json');
const descriptions = require('./descriptions.json');

const result = {
  fuels: descriptions.fuels,
  statuses: descriptions.statuses,
};

(async () => {
  data.forEach((station) => {
    const { status } = station;

    Object.keys(status).forEach((fuel) => {
      result.fuels[fuel] = descriptions.fuels[fuel] ?? true;
    });
  });

  await fs.writeFile('descriptions.json', JSON.stringify(result, null, 2));
})();
