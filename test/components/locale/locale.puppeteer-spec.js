const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Locale', () => {
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
      expect(img).toMatchImageSnapshot(config);
    });
  });

  describe('Locale date format in Latvian tests', () => {
    const url = `${baseUrl}/test-format-date.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the correct date format for Latvian', async () => {
      await page.evaluate(() => document.querySelector('#date-field5').value)
        .then(value => expect(value).toEqual('05.12.2019.'));
    });
  });
});
