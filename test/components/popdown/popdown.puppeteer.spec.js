describe('popdown Puppeteer Tests', () => {
  describe('Outside Event Tests', () => {
    const url = 'http://localhost:4000/components/popdown/test-click-outside.html';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should show have outside event', async () => {
      // |----------------------------------------------------------|
      // | https://github.com/infor-design/enterprise/issues/3618   |
      // |----------------------------------------------------------|
      await page.click('#popdown-example-trigger');
      await page.waitForSelector('#maincontent');
      await page.click('#maincontent');
      await page.waitForSelector('[data-automation-id="popover-listview-example-automation-id"]');
      await page.click('[data-automation-id="popover-listview-example-automation-id"]');
      await page.waitForTimeout(2000);

      const message = page.on('console', msg => msg.text());
      await page.click('#maincontent');
      await expect(message).toMatch('click outside');
    });
  });
});
