const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Textarea Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/textarea';

  describe('Index', () => {
    const url = `${baseUrl}/example-index?theme=classic`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.waitForSelector('#description-max', { visible: true });

      const descriptionMaxInput = await page.$('#description-max');
      const image = await descriptionMaxInput.screenshot();
      const config = getConfig('textarea-init');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Rows', () => {
    const url = `${baseUrl}/test-rows?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.setViewport({ width: 760, height: 600 });
    });

    it('should not visually regress', async () => {
      await page.waitForSelector('.container', { visible: true });

      const container = await page.$('.container');
      const image = await container.screenshot();
      const config = getConfig('textarea-rows');
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
