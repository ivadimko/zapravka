const playwright = require('playwright');

async function main() {
  const browser = await playwright.chromium.launch({
    headless: true, // set this to true
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
  });

  const page = await context.newPage();

  await page.goto('https://www.okko.ua/api/uk/fuel-map');

  await page.waitForSelector('pre', {
    timeout: 2000,
  });

  const content = await page.locator('pre').textContent();
  await browser.close();

  return JSON.parse(content);
}

module.exports = {
  scrapeOkko: main,
};
