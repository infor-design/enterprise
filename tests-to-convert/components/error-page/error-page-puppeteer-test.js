describe('Error Page Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/error-page';

  describe('Error Page example-index tests', () => {
    const url = `${baseUrl}/example-index.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should be able to set id/automations', async () => {
      expect(await page.$eval('#error-page-content-id-1', el => el.getAttribute('id'))).toEqual('error-page-content-id-1');
      expect(await page.$eval('#error-page-content-id-1', el => el.getAttribute('data-automation-id'))).toEqual('automation-id-errorpage-1');

      expect(await page.$eval('#error-page-btn-id-1', el => el.getAttribute('id'))).toEqual('error-page-btn-id-1');
      expect(await page.$eval('#error-page-btn-id-1', el => el.getAttribute('data-automation-id'))).toEqual('automation-id-errorpage-btn-1');
    });
  });
});
