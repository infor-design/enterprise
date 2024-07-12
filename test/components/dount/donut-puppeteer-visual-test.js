const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Donut Chart Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components';

  describe('Donut Chart tests', () => {
    beforeEach(async () => {
      const url = `${baseUrl}/donut/example-index?theme=classic&layout=nofrills`;
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      // Resize the viewport
      await page.setViewport({ width: 1200, height: 800 });

      // Make sure element is on the page
      expect(await page.waitForSelector('.container')).toBeTruthy();

      // Add a bit of a delay

      // Screenshot of the page
      const image = await page.screenshot();

      // Set a custom name of the snapshot
      const config = getConfig('donut');

      // Compare the images
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Donut Chart alerts tests', () => {
    beforeEach(async () => {
      const url = `${baseUrl}/donut/example-alerts?theme=classic&layout=nofrills`;
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      // Resize the viewport
      await page.setViewport({ width: 1200, height: 800 });

      // Make sure element is on the page
      expect(await page.waitForSelector('.container')).toBeTruthy();

      // Add a bit of a delay

      // Screenshot of the page
      const image = await page.screenshot();

      // Set a custom name of the snapshot
      const config = getConfig('donut-alerts');

      // Compare the images
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Donut Chart popup tests', () => {
    beforeEach(async () => {
      const url = `${baseUrl}/donut/example-legend-bottom-popup?layout=nofrills`;
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      // Resize the viewport
      await page.setViewport({ width: 1200, height: 800 });

      // Make sure element is on the page
      expect(await page.waitForSelector('.container')).toBeTruthy();

      // Add a bit of a delay

      // Screenshot of the page
      const image = await page.screenshot();

      // Set a custom name of the snapshot
      const config = getConfig('donut-popup');

      // Compare the images
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
