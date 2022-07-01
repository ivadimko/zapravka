import * as path from 'path';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import { chromium } from 'playwright-chromium';
import { AmicGasStation } from '@/stations/amic/amic.typedefs';

export class AmicScraper {
  private readonly filePath = path.resolve(__dirname, 'amic.raw.json');
  private readonly logger = new Logger(AmicScraper.name);

  async scrape(): Promise<AmicGasStation[]> {
    let fallback: string | undefined = undefined;

    try {
      fallback = (await fs.promises.readFile(this.filePath)).toString();
    } catch (error) {
      this.logger.warn('File missing', this.filePath);
    }

    try {
      const STATIONS_API_ENDPOINT = 'https://amicenergy.com.ua/api/get_azs/';

      const PAGE_URL = 'https://amicenergy.com.ua/ua/prodykciya?gclid=123xyz';

      const stations = await fetch(STATIONS_API_ENDPOINT).then((res) =>
        res.json(),
      );

      const browser = await chromium.launch({
        headless: true, // set this to true
      });

      const context = await browser.newContext({
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
      });

      const page = await context.newPage();

      await page.goto(PAGE_URL);

      await page.waitForSelector('#StatusTable', {
        timeout: 2000,
      });

      const fuelData = await page.$$eval(
        '#StatusTable tbody tr',
        (stations) => {
          return stations.reduce((allStations, station) => {
            const id = station.querySelector('td').textContent;
            const statusString = station.className
              .replaceAll('Stor', '')
              .trim();

            const status = statusString.split(' ').reduce((acc, cur) => {
              if (cur !== '') {
                acc[cur] = true;
              }

              return acc;
            }, {});

            allStations[id] = status;

            return allStations;
          }, {});
        },
      );

      await browser.close();

      const result = Object.entries(stations).map(([name, station]) => {
        const id = name.replaceAll('АЗС ', '').replaceAll('-', '');

        const status = fuelData[id];

        return {
          id,
          name,
          ...(station as AmicGasStation),
          status,
        };
      });

      const stringifiedResult = JSON.stringify(result);

      this.logger.log(
        'AMIC CONTENT LOADED',
        `${stringifiedResult.slice(0, 20)}...`,
      );

      await fs.promises.writeFile(this.filePath, stringifiedResult);

      return result;
    } catch (error) {
      if (fallback) {
        this.logger.warn(error.message);

        return JSON.parse(fallback);
      }

      throw error;
    }
  }
}
