import * as path from 'path';
import * as fs from 'fs/promises';
import { Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import { MottoGasStationRaw } from '@/stations/motto/motto.typedefs';
import { OkkoGasStation } from '@/stations/okko/okko.typedefs';

interface AllStationsApiResponse {
  FuelStations: MottoGasStationRaw[];
  Goods: Array<{
    code: number;
    name: string;
    id: string;
  }>;
}

export class MottoScraper {
  private readonly filePath = path.resolve(__dirname, 'motto.raw.json');
  private readonly logger = new Logger(MottoScraper.name);

  async scrape(): Promise<MottoGasStationRaw[]> {
    let fallback: string | undefined = undefined;

    try {
      fallback = (await fs.readFile(this.filePath)).toString();
    } catch (error) {
      this.logger.warn('File missing', this.filePath);
    }

    try {
      const API_ENDPOINT = 'https://thebestapp4ever.wog.ua/Map/api/locations';

      const response: AllStationsApiResponse = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ brand: ['2'], fuel: [], availability: [] }),
      }).then((res) => {
        return res.json();
      });

      const result = response.FuelStations;

      const content = JSON.stringify(result);

      this.logger.log('MOTTO CONTENT LOADED', `${content.slice(0, 20)}...`);

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
