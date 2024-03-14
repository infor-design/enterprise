const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Column Chart Puppeteer Visual Tests', () => {
  describe.skip('Ability to make a combined column chart and line chart tests', () => {
    const url = 'http://localhost:4000/components/column-grouped/example-column-grouped-with-line-combined';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should run visual test', async () => {
      await page.waitForSelector('#column-line-id-dot-6');

      const image = await page.screenshot();
      const config = getConfig('line-chart');
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
