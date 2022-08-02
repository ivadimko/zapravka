import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs/promises';
import { OkkoScraper } from '@/stations/okko/okko.scraper';
import { OkkoEntity } from '@/stations/okko/okko.entity';

@Injectable()
export class OkkoService {
  private readonly logger = new Logger(OkkoService.name);
  private readonly filePath = path.resolve(__dirname, 'okko.data.json');
  private readonly scraper = new OkkoScraper();

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

  async findById(id: string, attempt = 1) {
    try {
      const file = await fs.readFile(this.filePath);

      const data = JSON.parse(file.toString());

      return data.find((el) => el.id === id);
    } catch (error) {
      this.logger.warn('Missing file', this.filePath);

      if (attempt === 3) {
        return null;
      }

      await this.scrape();

      return this.findById(id, attempt + 1);
    }
  }

  @Cron('0 4/10 * * * *')
  async scrape() {
    const result = await this.scraper.scrape();

    const stations = result.data.layout[0].data.list.collection.map(
      (station) => {
        const okkoEntity = new OkkoEntity(station);

        return okkoEntity.map();
      },
    );

    await fs.writeFile(this.filePath, JSON.stringify(stations));
  }
}
