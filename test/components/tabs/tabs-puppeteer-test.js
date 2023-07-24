describe('Tabs Puppeteer tests', () => {
  const baseUrl = 'http://localhost:4000/components/tabs';

  describe('Tabs title in new tab tests', () => {
    const url = `${baseUrl}/example-add-tab-button.html`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should have a tooltip title', async () => {
      await page.hover('div[data-automation-id="tabs-test-btn-add"]');

      await page.waitForSelector('#tooltip', { visible: true })
        .then(async (element) => {
          const display = await page.$eval('.tooltip', e => e.getAttribute('class'));
          const tooltip = await element.$eval('.tooltip-content', e => e.textContent);

          expect(display).toContain('is-open');
          expect(tooltip).toContain('Add new tab');
        });
    });
  });
});
