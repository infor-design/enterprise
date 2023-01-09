/* eslint-disable compat/compat */
const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Bullet Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/bullet';

  describe('Index tests', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.waitForFunction('document.querySelectorAll(".bullet .range").length > 0');
    });

    it('should not visual regress', async () => {
      const img = await page.screenshot();
      const sConfig = getConfig('bullet');
      expect(img).toMatchImageSnapshot(sConfig);
    });
  });

  describe('Data group tests', () => {
    const url = `${baseUrl}/example-data-group?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visual regress', async () => {
      const img = await page.screenshot();
      const sConfig = getConfig('bullet-data-group');
      expect(img).toMatchImageSnapshot(sConfig);
    });
  });

  describe('Negative positive tests', () => {
    const url = `${baseUrl}/test-negative-positive-value?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visual regress', async () => {
      const img = await page.screenshot();
      const sConfig = getConfig('bullet-negative-positive');
      expect(img).toMatchImageSnapshot(sConfig);
    });
  });

  describe('Negative values tests', () => {
    const url = `${baseUrl}/test-negative-value?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visual regress', async () => {
      const img = await page.screenshot();
      const sConfig = getConfig('bullet-negative');
      expect(img).toMatchImageSnapshot(sConfig);
    });
  });
});
