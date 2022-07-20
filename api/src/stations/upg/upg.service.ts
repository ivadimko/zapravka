import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Cron } from '@nestjs/schedule';
import { UPGScraper } from '@/stations/upg/upg.scraper';
import { UPGEntity } from '@/stations/upg/upg.entity';

@Injectable()
export class UpgService {
  private readonly logger = new Logger(UpgService.name);
  private readonly filePath = path.resolve(__dirname, 'upg.data.json');
  private readonly scraper = new UPGScraper();

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

  @Cron('0 5/10 * * * *')
  async scrape() {
    const result = await this.scraper.scrape();

    const stations = result.data.map((station) => {
      const entity = new UPGEntity(station);

      return entity.map();
    });

    await fs.writeFile(this.filePath, JSON.stringify(stations));
  }
}
