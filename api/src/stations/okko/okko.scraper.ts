import { chromium } from 'playwright-chromium';
import { OkkoGasStation } from '@/stations/okko/okko.typedefs';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Logger } from '@nestjs/common';

interface AllStationsApiResponse {
  data: {
    layout: Array<{
      data: {
        list: {
          collection: Array<OkkoGasStation>;
        };
      };
    }>;
  };
}

export class OkkoScraper {
  private readonly filePath = path.resolve(__dirname, 'okko.raw.json');
  private readonly logger = new Logger(OkkoScraper.name);

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

      await page.goto('https://www.okko.ua/api/uk/fuel-map?gclid=123xyz');

      await page.waitForSelector('pre', {
        timeout: 2000,
      });

      const content = await page.locator('pre').textContent();
      await browser.close();

      this.logger.log('OKKO CONTENT LOADED', `${content.slice(0, 20)}...`);

      await fs.writeFile(this.filePath, content);

      return JSON.parse(content);
    } catch (error) {
      if (fallback) {
        this.logger.warn(error.message);

        return JSON.parse(fallback);
      }

      throw error;
    }
  }
}
