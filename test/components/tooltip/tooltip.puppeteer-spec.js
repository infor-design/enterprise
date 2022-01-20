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

      await page.waitForSelector('.tooltip.is-open', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

    it('should show the tooltip on keyboard tab', async () => {
      page.keyboard.press('Tab');
      await page.waitForSelector('.tooltip.is-open', { visible: true })
        .then(element => expect(element).toBeTruthy());
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

      await page.waitForSelector('.tooltip.is-open', { visible: true })
        .then(element => expect(element).toBeTruthy());
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

      await page.waitForSelector('.tooltip.is-open', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });
  });
});
