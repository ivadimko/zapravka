const fs = require('fs/promises');
const { scrapeUpg } = require('./upg-scraper');
const descriptions = require('./descriptions.json');

const generateUPGDescriptions = async () => {
  const descriptionsData = descriptions;

  const content = await scrapeUpg();

  content.data.forEach((station) => {
    station.FuelsAsArray.forEach((fuel) => {
      descriptionsData.fuels[fuel.Title] = true;
    });
  });

  await fs.writeFile('descriptions.json', JSON.stringify(descriptionsData, null, 2));
  await fs.writeFile('upg-stations.json', JSON.stringify(content, null, 2));
};

generateUPGDescriptions();
