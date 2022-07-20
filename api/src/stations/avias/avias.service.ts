import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Cron } from '@nestjs/schedule';
import { AviasScraper } from '@/stations/avias/avias.scraper';
import { AviasEntity } from '@/stations/avias/avias.entity';

@Injectable()
export class AviasService {
  private readonly logger = new Logger(AviasService.name);
  private readonly filePath = path.resolve(__dirname, 'avias.data.json');
  private readonly scraper = new AviasScraper();

  async findAll(attempt = 1) {
    try {
      const file = await fs.readFile(this.filePath);

      return JSON.parse(file.toString());
    } catch (error) {
      this.logger.warn('Missing file', this.filePath);

      if (attempt === 3) {
        return [];
      }

      await this.scrape();

      return this.findAll(attempt + 1);
    }
  }

  @Cron('0 1/10 * * * *')
  async scrape() {
    const result = await this.scraper.scrape();

    const stations = result.data.map((station) => {
      const entity = new AviasEntity(station, result.fuels);

      return entity.map();
    });

    await fs.writeFile(this.filePath, JSON.stringify(stations));
  }
}
