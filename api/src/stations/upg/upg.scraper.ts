import { chromium } from 'playwright-chromium';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Logger } from '@nestjs/common';
import { UPGGasStation } from '@/stations/upg/upg.typedefs';

interface AllStationsApiResponse {
  countData: number;
  data: Array<UPGGasStation>;
}

export class UPGScraper {
  private readonly filePath = path.resolve(__dirname, 'upg.raw.json');
  private readonly logger = new Logger(UPGScraper.name);

  async scrape(): Promise<AllStationsApiResponse> {
    let fallback: string | undefined = undefined;

    try {
      fallback = (await fs.readFile(this.filePath)).toString();
    } catch (error) {
      this.logger.warn('File missing', this.filePath);
    }

    try {
      const browser = await chromium.launch({
        headless: true, // set this to true
      });

      const context = await browser.newContext({
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
      });

      const page = await context.newPage();

      await page.goto('https://upg.ua/merezha_azk?gclid=123xyz');

      const content: AllStationsApiResponse = await page.evaluate('objmap');
      await browser.close();

      this.logger.log('UPG CONTENT LOADED', `${content.countData}...`);

      await fs.writeFile(this.filePath, JSON.stringify(content));

      return content;
    } catch (error) {
      if (fallback) {
        this.logger.warn(error.message);

        return JSON.parse(fallback);
      }

      throw error;
    }
  }
}
