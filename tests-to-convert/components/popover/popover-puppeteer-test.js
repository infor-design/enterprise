describe('Popover Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/popover';

  describe('Popover as a tooltip with maxWidth', () => {
    const url = `${baseUrl}/test-using-max-width-setting`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should work the maxWidth setting', async () => {
      const popoverBtn = await page.waitForSelector('#popover-trigger', { visible: true });
      await popoverBtn.click();

      await page.evaluate(() => document.querySelector('.popover.is-open').style.maxWidth)
        .then(maxWidth => expect(maxWidth).toBe('350px'));
    });
  });
});
