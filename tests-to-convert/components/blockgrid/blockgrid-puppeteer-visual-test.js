
const { getConfig } = require('../../helpers/e2e-utils.cjs');

/* eslint-disable compat/compat */
describe('Blockgrid Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/blockgrid';

  describe('Mixed selection responsive tests', () => {
    const url = `${baseUrl}/example-mixed-selection?theme=classic&layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should not visually regress', async () => {
      const img = await page.screenshot();
      const sConfig = getConfig('blockgrid');
      expect(img).toMatchImageSnapshot(sConfig);
    });

    it('should not visually regress at 500px', async () => {
      const windowSize = await page.viewport();
      await page.setViewport({ width: 500, height: windowSize.height });
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });

      const img = await page.screenshot();
      const sConfig = getConfig('blockgrid-500px');
      expect(img).toMatchImageSnapshot(sConfig);

      await page.setViewport(windowSize);
    });

    it('should not visually regress at 320px', async () => {
      const windowSize = await page.viewport();
      await page.setViewport({ width: 320, height: windowSize.height });
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });

      const img = await page.screenshot();
      const sConfig = getConfig('blockgrid-320px');
      expect(img).toMatchImageSnapshot(sConfig);

      await page.setViewport(windowSize);
    });
  });
});
