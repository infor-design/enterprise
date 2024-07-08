const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Personalize', () => {
  const baseUrl = 'http://localhost:4000/components/personalize';

  describe('Color theme API', () => {
    const url = `${baseUrl}/example-color-theme-api.html?theme=new&mode=dark`;
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress on dark theme default color', async () => {
      await page.waitForSelector('.swatch', { visible: true });
      const image = await page.screenshot();
      const config = getConfig('personalize-dark-theme-default-color');
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
