import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Cron } from '@nestjs/schedule';
import { BrsmScraper } from '@/stations/brsm/brsm.scraper';
import { BrsmEntity } from '@/stations/brsm/brsm.entity';

@Injectable()
export class BrsmService {
  private readonly logger = new Logger(BrsmService.name);
  private readonly filePath = path.resolve(__dirname, 'brsm.data.json');
  private readonly scraper = new BrsmScraper();

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

  @Cron('0 2/10 * * * *')
  async scrape() {
    const result = await this.scraper.scrape();

    const stations = result.map((station) => {
      const entity = new BrsmEntity(station);
      return entity.map();
    });

    await fs.writeFile(this.filePath, JSON.stringify(stations));
  }
}
