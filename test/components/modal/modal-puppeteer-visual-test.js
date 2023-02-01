const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Modal Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/modal';

  describe('Modal Puppeteer init example-modal tests', () => {
    const url = `${baseUrl}/example-index`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
      await page.waitForSelector('#add-context', { visible: true });
    });

    it('should not visually regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });
      await page.click('#add-context');
      await page.waitForSelector('.overlay', { visible: true });

      expect(await page.waitForSelector('.modal.is-visible.is-active')).toBeTruthy();

      // Need a bit of delay to show the modal perfectly
      await page.waitForTimeout(290);

      // Click title to have no focus
      await page.click('.modal-title');
      // Screenshot of the page
      const image = await page.screenshot();

      // Set a custom name of the snapshot
      const config = getConfig('modal-open');
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
