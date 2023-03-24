const { getConfig } = require('../../helpers/e2e-utils.js');

describe('ProcessIndicator Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/processindicator';

  describe('ProcessIndicator tests', () => {
    const url = `${baseUrl}/example-index`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it.skip('Should not visual regress', async () => {
      // Need a bit of delay to make sure everything is showing
      await page.waitForTimeout(200);

      // Screenshot of the page
      const image = await page.screenshot();

      // Set a custom name of the snapshot
      const config = getConfig('processindicator');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('ProcessIndicator Labels tests', () => {
    const url = `${baseUrl}/example-labels`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it.skip('Should not visual regress', async () => {
      // Need a bit of delay to make sure everything is showing
      await page.waitForTimeout(290);

      // Screenshot of the page
      const image = await page.screenshot();

      // Set a custom name of the snapshot
      const config = getConfig('processindicator-labels');
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
