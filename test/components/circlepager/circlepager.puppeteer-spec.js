const { getConfig } = require('../../helpers/e2e-utils.js');

describe('Circlepager Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/circlepager';

  describe('Index Tests', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should not visual regress', async () => {
      expect(await page.waitForSelector('div[role=main]')).toBeTruthy();

      const image = await page.screenshot();
      const config = getConfig('circlepager');
      expect(image).toMatchImageSnapshot(config);
    });

    it('should be able to set id/automation', async () => {
      expect(await page.$eval('#circlepager-id-1', el => el.id)).toBe('circlepager-id-1');
      expect(await page.$eval('#circlepager-id-1', el => el.getAttribute('data-automation-id'))).toBe('automation-id-circlepager-1');
    });
  });
});
