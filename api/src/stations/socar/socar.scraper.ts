import * as path from 'path';
import * as fs from 'fs/promises';
import { Logger } from '@nestjs/common';
import { SocarGasStationRaw } from '@/stations/socar/socar.typedefs';
import fetch from 'node-fetch';

interface AllStationsApiResponse {
  data: Array<SocarGasStationRaw>;
}

export class SocarScraper {
  private readonly filePath = path.resolve(__dirname, 'socar.raw.json');
  private readonly logger = new Logger(SocarScraper.name);

  async scrape(): Promise<AllStationsApiResponse> {
    let fallback: string | undefined = undefined;

    try {
      fallback = (await fs.readFile(this.filePath)).toString();
    } catch (error) {
      this.logger.warn('File missing', this.filePath);
    }

    try {
      const API_ENDPOINT =
        'https://socar.ua/api/map/stations?region=&services=';

      const result = await fetch(API_ENDPOINT).then((res) => {
        return res.json();
      });

      const content = JSON.stringify(result);

      console.info('SOCAR CONTENT LOADED', `${content.slice(0, 20)}...`);

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
