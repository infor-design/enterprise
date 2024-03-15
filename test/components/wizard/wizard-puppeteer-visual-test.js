const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Wizard Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/wizard';

  describe('Wizard example index visual tests', () => {
    const url = `${baseUrl}/example-index`;

    beforeEach(async () => {
      await page.goto(url, { waitUnitl: ['domcontentloaded', 'networkidle2'] });
    });

    it.skip('should not visually regress', async () => {
      const wizard = await page.$('.wizard');
      const image = await wizard.screenshot();
      const config = getConfig('wizard');

      expect(image).toMatchImageSnapshot(config);
    });
  });
});
