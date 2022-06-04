import path from 'path';
import fs from 'fs/promises';
import { scrapeOkko } from './okko-scraper.mjs';

const main = async () => {
  const filePath = path.resolve('src/data/okko/okko-stations.json');

  const stations = await scrapeOkko();

  await fs.writeFile(filePath, JSON.stringify(stations, null, 2));
};

main();
