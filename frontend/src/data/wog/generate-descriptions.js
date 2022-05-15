const fs = require('fs/promises');

const data = require('./station-status.json');
const descriptions = require('./descriptions.json');

const result = {
  fuels: {},
  statuses: {},
};

data.forEach((station) => {
  const description = station.data.workDescription;

  const rows = description.split('\n');

  rows.forEach((row) => {
    const [fuel, status] = row.split(' - ');

    if (fuel && status) {
      result.fuels[fuel] = descriptions.fuels[fuel] ?? true;
      result.statuses[status] = descriptions.statuses[status] ?? true;
    }
  });
});

await fs.writeFile('descriptions.json', JSON.stringify(result, null, 2));
