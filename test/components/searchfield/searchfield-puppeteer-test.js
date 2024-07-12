const { checkInnerHTMLValue } = require('../../helpers/e2e-utils.cjs');

describe('Searchfield Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/searchfield';

  describe('should support custom icon buttons', () => {
    const url = `${baseUrl}/example-buttons`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should have custom icon', async () => {
      await page.waitForSelector('.custom-button', { visible: true })
        .then(element => expect(element).toBeTruthy());
      const barCodeicon = await checkInnerHTMLValue('.custom-button', 'svg class="icon"');
      expect(barCodeicon).toBe(false);
      await page.click('.custom-button');
      await page.waitForSelector('#toast-container', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

    it('should have x icon', async () => {
      await page.type('#searchfield', 'test');
      await page.waitForSelector('.close', { visible: true })
        .then(element => expect(element).toBeTruthy());
      await page.click('.close');
      await page.waitForSelector('#toast-container', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });
  });
});
