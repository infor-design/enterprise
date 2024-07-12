const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Counts Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/counts';

  describe('Counts example-index tests', () => {
    const url = `${baseUrl}/example-index.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });

      expect(await page.waitForSelector('#maincontent')).toBeTruthy();

      const image = await page.screenshot();
      const config = getConfig('counts-index');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Counts example-widget-count tests', () => {
    const url = `${baseUrl}/example-widget-count?&locale=he-IL`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });

      expect(await page.waitForSelector('#maincontent')).toBeTruthy();

      const image = await page.screenshot();
      const config = getConfig('counts-widget');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Counts example-not-actionable tests', () => {
    const url = `${baseUrl}/example-not-actionable`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });

      expect(await page.waitForSelector('#maincontent')).toBeTruthy();

      const image = await page.screenshot();
      const config = getConfig('counts-not-actionable');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Counts example-short tests', () => {
    const url = `${baseUrl}/example-short`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
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
