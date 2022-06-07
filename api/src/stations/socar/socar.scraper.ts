import * as path from 'path';
import * as fs from 'fs/promises';
import { Logger } from '@nestjs/common';
import { SocarGasStationRaw } from '@/stations/socar/socar.typedefs';
import fetch from 'node-fetch';

export class SocarScraper {
  private readonly filePath = path.resolve(__dirname, 'socar.raw.json');
  private readonly logger = new Logger(SocarScraper.name);

  async scrape(): Promise<SocarGasStationRaw[]> {
    let fallback: string | undefined = undefined;

    try {
      fallback = (await fs.readFile(this.filePath)).toString();
    } catch (error) {
      this.logger.warn('File missing', this.filePath);
    }

    try {
      const API_ENDPOINT = 'https://api.socar.ua:9043/stations';

      const { results } = await fetch(API_ENDPOINT).then((res) => {
        return res.json();
      });

      const result: Array<SocarGasStationRaw> = [];

      const parts = [];

      let start = 0;

      const STEP = 100;

      while (start < results.length) {
        const end = Math.min(start + STEP, results.length);

        const part = results.slice(start, end);

        parts.push(part);

        start = end;
      }

      await parts.reduce(
        async (
          promise: Promise<any>,
          part: Array<SocarGasStationRaw>,
          i: number,
        ) => {
          await promise;

          this.logger.log(
            `procesing part ${i + 1}/${parts.length}, ${part.length} items`,
          );

          const temp = await Promise.all(
            part.map(async (station) => {
              const stationData = await fetch(
                `${API_ENDPOINT}/${station.id}`,
              ).then((response) => {
                return response.json();
              });

              return stationData;
            }),
          );

          result.push(...temp);
        },
        Promise.resolve(),
      );

      const content = JSON.stringify(result);

      this.logger.log('SOCAR CONTENT LOADED', `${content.slice(0, 20)}...`);

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
