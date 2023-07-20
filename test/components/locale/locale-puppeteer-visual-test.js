const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Locale Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/locale';

  describe('Locale visual test for PH - Translation', () => {
    const url = `${baseUrl}/test-translations.html?locale=tl-PH`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.setViewport({ width: 1920, height: 1080 });
    });

    it('should run visual test for locale-ph', async () => {
      await page.waitForSelector('#tabs-2');
      const img = await page.screenshot();
      const config = getConfig('locale-ph');

      // eslint-disable-next-line
      expect(img).toMatchImageSnapshot(config);
    });
  });
});
