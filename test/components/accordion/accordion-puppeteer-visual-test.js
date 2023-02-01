
const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Accordion Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/accordion';

  describe('Disabled', () => {
    const url = `${baseUrl}/example-disabled?theme=classic&layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should not visually regress', async () => {
      await page.waitForFunction('document.querySelectorAll("div[role=main]").length > 0');
      await page.waitForTimeout(1000);
      const img = await page.screenshot();
      const sConfig = getConfig('accordion-disabled');
      expect(img).toMatchImageSnapshot(sConfig);
    });
  });

  describe('Index', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should not visually regress', async () => {
      await page.click('button:nth-child(2)');
      await page.waitForTimeout(1000);
      const img = await page.screenshot();
      const sConfig = getConfig('accordion');
      expect(img).toMatchImageSnapshot(sConfig);
    });
  });
});
