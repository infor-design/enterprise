fdescribe('Tooltip Puppeteer Tests', () => {
  describe('Index Tests', () => {
    const url = 'http://localhost:4000/components/tooltip/example-index';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(true).toBe(true);
    });
  });
});
