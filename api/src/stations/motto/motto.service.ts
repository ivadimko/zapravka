import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Cron } from '@nestjs/schedule';
import { MottoEntity } from '@/stations/motto/motto.entity';
import { MottoScraper } from '@/stations/motto/motto.scraper';

@Injectable()
export class MottoService {
  private readonly logger = new Logger(MottoService.name);
  private readonly filePath = path.resolve(__dirname, 'motto.data.json');
  private readonly scraper = new MottoScraper();

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

  @Cron('0 3/10 * * * *')
  async scrape() {
    const result = await this.scraper.scrape();

    const stations = result.map((station) => {
      const entity = new MottoEntity(station);
      return entity.map();
    });

    await fs.writeFile(this.filePath, JSON.stringify(stations));
  }
}
