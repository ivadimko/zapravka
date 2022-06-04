import * as path from 'path';
import * as fs from 'fs/promises';
import { Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import {
  WogGasStationRaw,
  WogGasStationShort,
} from '@/stations/wog/wog.typedefs';

export class WogScraper {
  private readonly filePath = path.resolve(__dirname, 'wog.raw.json');
  private readonly logger = new Logger(WogScraper.name);

  async scrape(): Promise<WogGasStationRaw[]> {
    let fallback: string | undefined = undefined;

    try {
      fallback = (await fs.readFile(this.filePath)).toString();
    } catch (error) {
      this.logger.warn('File missing', this.filePath);
    }

    try {
      const API_ENDPOINT = 'https://api.wog.ua/fuel_stations?gclid=123xyz';

      const { data } = await fetch(API_ENDPOINT).then((res) => res.json());

      const result: Array<WogGasStationRaw> = [];

      const parts = [];

      let start = 0;

      const STEP = 100;

      while (start < data.stations.length) {
        const end = Math.min(start + STEP, data.stations.length);

        const part = data.stations.slice(start, end);

        parts.push(part);

        start = end;
      }

      await parts.reduce(
        async (
          promise: Promise<any>,
          part: Array<WogGasStationShort>,
          i: number,
        ) => {
          await promise;

          // eslint-disable-next-line no-console
          console.info(
            `procesing part ${i + 1}/${parts.length}, ${part.length} items`,
          );

          const temp = await Promise.all(
            part.map(async (station) => {
              const stationData = await fetch(station.link).then((response) => {
                return response.json();
              });

              return stationData.data;
            }),
          );

          result.push(...temp);
        },
        Promise.resolve(),
      );

      const content = JSON.stringify(result);

      console.info('WOG CONTENT LOADED', `${content.slice(0, 20)}...`);

      await fs.writeFile(this.filePath, content);

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
