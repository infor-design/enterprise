const config = require('../../helpers/e2e-config.cjs');
const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Autocomplete Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/autocomplete';
  const defaultId = 'autocomplete-default';

  const clickOnAutocomplete = () => page.waitForSelector(`#${defaultId}`, { visible: true }).then(async (element) => {
    await element.click();
    return element;
  });

  describe('Example Index', () => {
    const url = `${baseUrl}/example-index`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
      await clickOnAutocomplete().then(element => element.type(''));
    });

    it('should not visual regress', async () => {
      await page.setViewport({ width: 1920, height: 1080 });
      const autocompleteEl = await clickOnAutocomplete();
      autocompleteEl.type('a');

      await page.waitForSelector('#maincontent', { visible: true });
      await page.waitForTimeout(config.sleep);

      const img = await page.screenshot();
      const sConfig = getConfig('autocomplete');
      expect(img).toMatchImageSnapshot(sConfig);
    });
  });
});
