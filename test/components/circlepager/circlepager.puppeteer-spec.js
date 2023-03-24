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

    it.skip('should not visual regress', async () => {
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

  describe('Pager example-circlepager Tests', () => {
    const url = 'http://localhost:4000/components/pager/example-circlepager';
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the circle pager', async () => {
      const firstItem = await page.$eval('.example1 .slide-content:nth-child(1)', el => getComputedStyle(el).getPropertyValue('padding-top'));
      expect(firstItem).toBe('230px');
    });
  });
});
