import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Cron } from '@nestjs/schedule';
import { SocarScraper } from '@/stations/socar/socar.scraper';
import { SocarEntity } from '@/stations/socar/socar.entity';

@Injectable()
export class SocarService {
  private readonly logger = new Logger(SocarService.name);
  private readonly filePath = path.resolve(__dirname, 'socar.data.json');
  private readonly scraper = new SocarScraper();

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

    const stations = result.map((station) => {
      const entity = new SocarEntity(station);

      return entity.map();
    });

    await fs.writeFile(this.filePath, JSON.stringify(stations));
  }
}
