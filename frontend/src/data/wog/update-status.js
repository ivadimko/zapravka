const fs = require('fs/promises');
const fetch = require('node-fetch');

const result = [];

(async () => {
  const { data } = await fetch('https://api.wog.ua/fuel_stations')
    .then((res) => res.json());

  await data.stations.reduce(async (promise, station, i) => {
    await promise;

    // eslint-disable-next-line no-console
    console.info(`procesing station ${i + 1}/${data.stations.length}`, station.name);

    const stationData = await fetch(station.link)
      .then((response) => response.json());

    const description = stationData.data.workDescription;

    stationData.data.status = {};

    const rows = description.split('\n');

    rows.forEach((row) => {
      const [fuel, status] = row.split(' - ');

      if (fuel && status) {
        stationData.data.status[fuel] = status;
      }
    });

    result.push(stationData);
  }, Promise.resolve());

  await fs.writeFile('station-status.json', JSON.stringify(result, null, 2));
})();
