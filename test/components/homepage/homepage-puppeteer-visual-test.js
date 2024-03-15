const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe.skip('Homepage Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/homepage';

  describe('Homepage example hero widget tests', () => {
    const url = `${baseUrl}/example-hero-widget.html?theme=classic`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.setViewport({ width: 1200, height: 800 });
    });

    it('should not visually regress', async () => {
      // Need a bit of delay to show the modal perfectly

      expect(await page.waitForSelector('.homepage')).toBeTruthy();

      // Screenshot of the page
      const image = await page.screenshot();

      // Set a custom name of the snapshot
      const config = getConfig('homepage-hero');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Homepage example editable tests', () => {
    const url = `${baseUrl}/example-editable.html?theme=classic`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });

      expect(await page.waitForSelector('.homepage')).toBeTruthy();

      // Need a bit of delay to show the modal perfectly

      // Screenshot of the page
      const image = await page.screenshot();

      // Set a custom name of the snapshot
      const config = getConfig('homepage-editable');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Homepage example five column tests', () => {
    const url = `${baseUrl}/example-five-column.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });

      expect(await page.waitForSelector('.homepage')).toBeTruthy();

      // Need a bit of delay to show the modal perfectly

      // Screenshot of the page
      const image = await page.screenshot();

      // Set a custom name of the snapshot
      const config = getConfig('homepage-five-column');
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
