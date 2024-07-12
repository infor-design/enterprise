const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Spinbox Puppeteer Visual Tests', () => {
  describe('Example-sizes', () => {
    const url = 'http://localhost:4000/components/spinbox/example-sizes.html?theme=uplift&variant=light';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
      await page.setViewport({
        width: 320,
        height: 1250,
        isMobile: true,
        deviceScaleFactor: 2,
      });
    });

    it('should run visual test', async () => {
      await page.waitForSelector('#xs-spinbox-example', { visible: true });
      const image = await page.screenshot();
      const config = getConfig('xs-spinbox');
      expect(image).toMatchImageSnapshot(config);
    });
  });
});

