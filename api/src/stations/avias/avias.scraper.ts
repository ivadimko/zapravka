import * as path from 'path';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import {
  AviasFuelInfo,
  AviasGasStationRaw,
} from '@/stations/avias/avias.typedefs';
import * as extract from 'extract-zip';

interface AllStationsApiResponse {
  status: string;
  code: number;
  data: AviasGasStationRaw[];
  fuels: AviasFuelInfo[];
}

export class AviasScraper {
  private readonly zipFilePath = path.resolve(__dirname, 'avias.raw.zip');
  private readonly filePath = path.resolve(__dirname, 'avias.raw.json');
  private readonly logger = new Logger(AviasScraper.name);

  async scrape(): Promise<AllStationsApiResponse> {
    let fallback: string | undefined = undefined;

    try {
      fallback = (await fs.promises.readFile(this.filePath)).toString();
    } catch (error) {
      this.logger.warn('File missing', this.filePath);
    }

    try {
      const FUELS_API_ENDPOINT = 'https://app-api.avias.ua/api/Fuel';

      const API_ENDPOINT =
        'https://app-api.avias.ua/api/avias/en/1265417/stations.zip';

      const fuels = await fetch(FUELS_API_ENDPOINT).then((res) => res.json());

      await fetch(API_ENDPOINT).then((res) => {
        return new Promise((resolve, reject) => {
          const dest = fs.createWriteStream(this.zipFilePath);
          res.body.pipe(dest);
          dest.on('close', () => resolve(null));
          dest.on('error', reject);
        });
      });

      const directory = path.resolve(__dirname, `result_${Date.now()}`);

      await extract(this.zipFilePath, {
        dir: directory,
      });

      const files = await fs.promises.readdir(directory);

      const stations = await fs.promises.readFile(
        path.resolve(directory, files[0]),
      );

      this.logger.log('AVIAS CONTENT LOADED', `${stations.slice(0, 20)}...`);

      const result = JSON.parse(stations.toString());
      result.fuels = fuels;

      await fs.promises.writeFile(this.filePath, JSON.stringify(result));

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
