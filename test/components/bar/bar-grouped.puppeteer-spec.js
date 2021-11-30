const { checkClassNameValue } = require('../../helpers/e2e-utils.js');

describe('Grouped Bar Chart Puppeteer Tests', () => {
  describe('Grouped Bar Chart Disable Selection  State Tests', () => {
    const url = 'http://localhost:4000/components/bar-grouped/example-disable-selection-state.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not able to tab through the legends', async () => {
      // eslint-disable-next-line
        const legendTabIndex = await page.$$eval('.chart-legend-item', e => e.map(el => el.tabIndex));
      expect(legendTabIndex).toEqual([-1, -1, -1, -1]); // These are the values of tabindex of all the legends.
    });

    it('should not select bar on click', async () => {
      const isFailed = [];
      const seriesA = '#bar-grouped-example > svg > g > g:nth-child(3)';
      const seriesB = '#bar-grouped-example > svg > g > g:nth-child(4)';
      const seriesC = '#bar-grouped-example > svg > g > g:nth-child(5)';

      // Series A
      await page.click(seriesA);
      await page.waitForTimeout(100);
      isFailed.push(await checkClassNameValue(seriesA, 'series-group'));
      isFailed.push(await checkClassNameValue(seriesB, 'series-group'));
      isFailed.push(await checkClassNameValue(seriesC, 'series-group'));
      await page.click(seriesA);
      await page.waitForTimeout(100);

      // Series B
      await page.click(seriesB);
      await page.waitForTimeout(100);
      isFailed.push(await checkClassNameValue(seriesA, 'series-group'));
      isFailed.push(await checkClassNameValue(seriesB, 'series-group'));
      isFailed.push(await checkClassNameValue(seriesC, 'series-group'));
      await page.click(seriesB);
      await page.waitForTimeout(100);

      // Series C
      await page.click(seriesC);
      await page.waitForTimeout(100);
      isFailed.push(await checkClassNameValue(seriesA, 'series-group'));
      isFailed.push(await checkClassNameValue(seriesB, 'series-group'));
      isFailed.push(await checkClassNameValue(seriesC, 'series-group'));
      await page.click(seriesC);
      await page.waitForTimeout(100);

      expect(isFailed).not.toContain(true);
    });

    it('should not select bar group on click in legends', async () => {
      const elHandleArray = await page.$$('.chart-legend-item');
      const isFailed = [];
      let index = 0;
      const seriesA = '#bar-grouped-example > svg > g > g:nth-child(3)';
      const seriesB = '#bar-grouped-example > svg > g > g:nth-child(4)';
      const seriesC = '#bar-grouped-example > svg > g > g:nth-child(5)';
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        await eL.hover();
        await page.click(`[index-id="chart-legend-${index}"]`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(seriesA, 'series-group'));
        isFailed.push(await checkClassNameValue(seriesB, 'series-group'));
        isFailed.push(await checkClassNameValue(seriesC, 'series-group'));
        await page.click(`[index-id="chart-legend-${index}"]`);
        await page.waitForTimeout(200);
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });
});
