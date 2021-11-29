const { checkClassNameValue } = require('../../helpers/e2e-utils.js');

describe('Radar Puppeteer Tests', () => {
  describe('Radar Disable Selection  State Tests', () => {
    const url = 'http://localhost:4000/components/radar/example-disable-selection-state.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not able to tab through the legends', async () => {
      const legendTabIndex = await page.$$eval('.chart-legend-item', e => e.map(el => el.tabIndex));
      expect(legendTabIndex).toEqual([-1, -1, -1]); // These are the values of tabindex of all the legends.
    });

    it('should not highlight when selected', async () => {
      const isFailed = [];
      const iphone = '#radar-iphone-area';
      const samsung = '#radar-samsung-area';
      const nokia = '#radar-nokia-area';
      await page.click(iphone);
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue(iphone, 'chart-radar-area'));
      isFailed.push(await checkClassNameValue(samsung, 'chart-radar-area'));
      isFailed.push(await checkClassNameValue(nokia, 'chart-radar-area'));
      await page.click(iphone);
      await page.waitForTimeout(200);

      await page.click(samsung);
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue(iphone, 'chart-radar-area'));
      isFailed.push(await checkClassNameValue(samsung, 'chart-radar-area'));
      isFailed.push(await checkClassNameValue(nokia, 'chart-radar-area'));
      await page.click(samsung);
      await page.waitForTimeout(200);

      await page.click(nokia);
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue(iphone, 'chart-radar-area'));
      isFailed.push(await checkClassNameValue(samsung, 'chart-radar-area'));
      isFailed.push(await checkClassNameValue(nokia, 'chart-radar-area'));
      await page.click(nokia);
      await page.waitForTimeout(200);
      expect(isFailed).not.toContain(true);
    });

    it('should not highlight on click in legends', async () => {
      const elHandleArray = await page.$$('.chart-radar-wrapper');
      const isFailed = [];
      let index = 0;
      const iphone = '#radar-iphone-area';
      const samsung = '#radar-samsung-area';
      const nokia = '#radar-nokia-area';
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let brand = '';
        await eL.click();
        switch (index) {
          case 0: // Line A
            brand = 'iphone';
            break;
          case 1: // Line B
            brand = 'samsung';
            break;
          case 2: // Line C
            brand = 'nokia';
            break;
          default:
            console.warn('line-group element not found');
        }
        await page.click(`#radar-${brand}-legend-${index}`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(iphone, 'chart-radar-area'));
        isFailed.push(await checkClassNameValue(samsung, 'chart-radar-area'));
        isFailed.push(await checkClassNameValue(nokia, 'chart-radar-area'));
        await page.click(`#radar-${brand}-legend-${index}`);
        await page.waitForTimeout(200);
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });
});

