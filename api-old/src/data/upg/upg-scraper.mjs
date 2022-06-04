import { chromium } from 'playwright-chromium';

export const scrapeUpg = async () => {
  const browser = await chromium.launch({
    headless: true, // set this to true
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
  });

  const page = await context.newPage();

  await page.goto('https://upg.ua/merezha_azs?gclid=123xyz');

  const content = await page.evaluate('objmap');
  await browser.close();

  console.info('UPG CONTENT LOADED', `${content.countData}...`);

  return content;
};
