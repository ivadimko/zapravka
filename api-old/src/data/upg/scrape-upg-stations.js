import path from 'path';
import fs from 'fs/promises';
import { scrapeUpg } from './upg-scraper.mjs';

const main = async () => {
  const filePath = path.resolve('src/data/upg/upg-stations.json');

  const stations = await scrapeUpg();

  await fs.writeFile(filePath, JSON.stringify(stations, null, 2));
};

main();
