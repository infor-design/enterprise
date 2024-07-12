const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Counts Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/counts';

  describe('Counts example-index tests', () => {
    const url = `${baseUrl}/example-index.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should have the size of 48px in xl-text font size', async () => {
      const fontSize = await page.$eval('span[class="xl-text"]', el => getComputedStyle(el).getPropertyValue('font-size'));
      expect(fontSize).toMatch('48px');
    });
  });

  describe('Counts example-widget-count tests', () => {
    const url = `${baseUrl}/example-widget-count?&locale=he-IL`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should have the title in center and below the counts', async () => {
      const textAlign = await page.$eval('span[class="title"]', el => getComputedStyle(el).getPropertyValue('text-align'));
      expect(textAlign).toMatch('center');
    });
  });

  describe('Counts example-not-actionable tests', () => {
    const url = `${baseUrl}/example-not-actionable`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should have the size of 48px in xl-text font size', async () => {
      const fontSize = await page.$eval('span[class="xl-text"]', el => getComputedStyle(el).getPropertyValue('font-size'));
      expect(fontSize).toMatch('48px');
    });
  });

  describe('Counts example-short tests', () => {
    const url = `${baseUrl}/example-short`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should have the size of 40px in xl-text font size', async () => {
      const fontSize = await page.$eval('span[class="xl-text"]', el => getComputedStyle(el).getPropertyValue('font-size'));
      expect(fontSize).toMatch('40px');
    });

    it('should not visually regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });

      expect(await page.waitForSelector('#maincontent')).toBeTruthy();

      const image = await page.screenshot();
      const config = getConfig('counts-short');
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
