describe('Header Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/header';

  describe('Header Index Tests', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should display header text', async () => {
      const headerTitle = await page.evaluate(() => document.querySelector('.title h1').textContent);

      expect(headerTitle).toEqual('Page Title');
    });
  });
});
