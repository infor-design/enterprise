const { checkInnerHTMLValue } = require('../../helpers/e2e-utils.cjs');

describe('Listview Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/listview';

  describe('should have filter and sort control', () => {
    const url = `${baseUrl}/example-filters`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should have filter icon', async () => {
      await page.waitForSelector('.btn-list-filter', { visible: true })
        .then(element => expect(element).toBeTruthy());
      const filtericon = await checkInnerHTMLValue('.btn-list-filter .icon', '#icon-filter');
      expect(filtericon).toBe(false);
      await page.hover('.btn-list-filter');
      await page.waitForSelector('#tooltip', { visible: true })
        .then(element => expect(element).toBeTruthy());
      const tooltip = await page.$eval('#tooltip .tooltip-content', items => items.textContent);
      expect(tooltip).toContain('Filter');
    });

    it('should have sort icon', async () => {
      await page.waitForSelector('.btn-list-sort', { visible: true })
        .then(element => expect(element).toBeTruthy());
      const filtericon = await checkInnerHTMLValue('.btn-list-sort .icon', '#icon-sort-down');
      expect(filtericon).toBe(false);
      await page.hover('.btn-list-sort');
      await page.waitForSelector('#tooltip', { visible: true })
        .then(element => expect(element).toBeTruthy());
      const tooltip = await page.$eval('#tooltip .tooltip-content', items => items.textContent);
      expect(tooltip).toContain('Sort');
    });
  });
});
