import * as path from 'path';
import * as fs from 'fs/promises';
import { Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import { BRSMGasStationRaw } from '@/stations/brsm/brsm.typedefs';

export class BrsmScraper {
  private readonly filePath = path.resolve(__dirname, 'brsm.raw.json');
  private readonly logger = new Logger(BrsmScraper.name);

  async scrape(): Promise<BRSMGasStationRaw[]> {
    let fallback: string | undefined = undefined;

    try {
      fallback = (await fs.readFile(this.filePath)).toString();
    } catch (error) {
      this.logger.warn('File missing', this.filePath);
    }

    try {
      const API_ENDPOINT =
        'https://td4.brsm-nafta.com/api/v2/Mobile/get_full_ffs';

      const results = await fetch(API_ENDPOINT).then((res) => {
        return res.json();
      });

      const result: Array<BRSMGasStationRaw> = [];

      const parts = [];

      let start = 0;

      const STEP = 50;

      while (start < results.length) {
        const end = Math.min(start + STEP, results.length);

        const part = results.slice(start, end);

        parts.push(part);

        start = end;
      }

      await parts.reduce(
        async (
          promise: Promise<any>,
          part: Array<BRSMGasStationRaw>,
          i: number,
        ) => {
          await promise;

          this.logger.log(
            `procesing part ${i + 1}/${parts.length}, ${part.length} items`,
          );

          const temp = await Promise.all(
            part.map(async (station) => {
              const stationFuelItems =
                station.fuels.length > 0
                  ? await fetch(
                      `https://td4.brsm-nafta.com/api/v2/mobile/fuel_prices/${station.id}`,
                    ).then((response) => {
                      return response.json();
                    })
                  : [];

              return {
                ...station,
                fuelsItems: stationFuelItems,
              };
            }),
          );

          result.push(...temp);
        },
        Promise.resolve(),
      );

      const content = JSON.stringify(result);

      this.logger.log('BRSM CONTENT LOADED', `${content.slice(0, 20)}...`);

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
