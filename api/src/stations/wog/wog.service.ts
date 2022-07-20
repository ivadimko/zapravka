import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Cron } from '@nestjs/schedule';
import { WogScraper } from '@/stations/wog/wog.scraper';
import { WogEntity } from '@/stations/wog/wog.entity';

@Injectable()
export class WogService {
  private readonly logger = new Logger(WogService.name);
  private readonly filePath = path.resolve(__dirname, 'wog.data.json');
  private readonly scraper = new WogScraper();

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

  @Cron('0 6/10 * * * *')
  async scrape() {
    const result = await this.scraper.scrape();

    const stations = result.map((station) => {
      const entity = new WogEntity(station);

      return entity.map();
    });

    await fs.writeFile(this.filePath, JSON.stringify(stations));
  }
}
