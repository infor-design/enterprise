describe('Spinbox Puppeteer Tests', () => {
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

    it('should renders all on one line, and appears to be the same width as the corresponding Input field', async () => {
      const inputWidth = await page.$eval('#xs-input-example', e => getComputedStyle(e).width);
      const spinboxWidth = await page.$eval('.spinbox-xs', e => getComputedStyle(e).width);
      expect(spinboxWidth).toBe(inputWidth);
    });
  });
});

