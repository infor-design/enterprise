describe('Tooltip Puppeteer Tests', () => {
  describe('Tooltips Index Page Tests', () => {
    const url = 'http://localhost:4000/components/tooltip/example-index?theme=classic&layout=nofrills';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should show the tooltip on mouse hover', async () => {
      const button = await page.$('#tooltip-btn');
      button.hover();

      const tooltip = page.waitForSelector('.tooltip.is-open', { visible: true })
      await expect(tooltip).toBeTruthy();
    });

    it('should show the tooltip on keyboard tab', async () => {
      page.keyboard.press('Tab');
      const tooltip = page.waitForSelector('.tooltip.is-open', { visible: true })
      await expect(tooltip).toBeTruthy();
    });

    it('should not display when tabbing through', async () => {
      page.keyboard.press('Tab');
      const tooltip = page.waitForSelector('.tooltip.is-open', { visible: true })
      await expect(tooltip).toBeTruthy();

      page.keyboard.press('Tab');
      const tooltip2 = page.waitForSelector('.tooltip.top.is-hidden', { visible: true })
      await expect(tooltip2).toBeTruthy();
    });
  });

  describe('Tooltips on icon tests', () => {
    const url = 'http://localhost:4000/components/tooltip/test-svg-icons';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should show the tooltip on mouse hover', async () => {
      const button = await page.$('#standalone-delete-icon');
      button.hover();

      const tooltip = page.waitForSelector('.tooltip.is-open', { visible: true })
      await expect(tooltip).toBeTruthy();
    });
  });

  describe('Tooltips icons page tests', () => {
    const url = 'http://localhost:4000/components/tooltip/example-icon-in-tooltip?theme=classic&layout=nofrills';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should show the tooltip with icon on mouse hover', async () => {
      const button = await page.$('#tooltip-btn');
      button.hover();

      const tooltip = page.waitForSelector('.tooltip.is-open', { visible: true })
      await expect(tooltip).toBeTruthy();
    });
  });
});
