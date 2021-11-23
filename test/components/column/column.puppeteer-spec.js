const { checkTooltipValue, checkClassNameValue } = require('../../helpers/e2e-utils.js');

describe('Column Chart Puppeteer Tests', () => {
  describe('Column Disable Selection  State tests', () => {
    const url = 'http://localhost:4000/components/column/example-disable-selection-state.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the tooltip with data', async () => {
      await page.setViewport({
        width: 1200,
        height: 800,
        deviceScaleFactor: 1,
      });
      const tooltip = '#svg-tooltip';
      const tooltipContent = '#svg-tooltip .tooltip-content';
      const isFailed = [];

      isFailed.push(await checkTooltipValue('rect.bar.series-0', tooltip, tooltipContent, '7 Automotive'));
      isFailed.push(await checkTooltipValue('rect.bar.series-1', tooltip, tooltipContent, '10 Distribution'));
      isFailed.push(await checkTooltipValue('rect.bar.series-2', tooltip, tooltipContent, '14 Equipment'));
      isFailed.push(await checkTooltipValue('rect.bar.series-3', tooltip, tooltipContent, '10 Fashion'));
      isFailed.push(await checkTooltipValue('rect.bar.series-4', tooltip, tooltipContent, '14 Food & Beverage'));
      await page.waitForTimeout(150);
      isFailed.push(await checkTooltipValue('rect.bar.series-5', tooltip, tooltipContent, '8 Healthcare'));
      isFailed.push(await checkTooltipValue('rect.bar.series-6', tooltip, tooltipContent, '7 Other'));
      expect(isFailed).not.toContain(true);
    });

    it('should not show pointer as a cursor', async () => {
      const checkCursor = async el => page.$eval(el, e => e.style.cursor);
      // series 1
      await page.hover('rect.bar.series-0');
      await page.waitForTimeout(100);
      expect(await checkCursor('rect.bar.series-0')).toContain('inherit');
      await page.hover('rect.bar.series-1');
      await page.waitForTimeout(100);
      expect(await checkCursor('rect.bar.series-1')).toContain('inherit');
      await page.hover('rect.bar.series-2');
      await page.waitForTimeout(100);
      expect(await checkCursor('rect.bar.series-2')).toContain('inherit');
      await page.hover('rect.bar.series-3');
      await page.waitForTimeout(100);
      expect(await checkCursor('rect.bar.series-3')).toContain('inherit');
      await page.hover('rect.bar.series-4');
      await page.waitForTimeout(100);
      expect(await checkCursor('rect.bar.series-4')).toContain('inherit');
      await page.hover('rect.bar.series-5');
      await page.waitForTimeout(100);
      expect(await checkCursor('rect.bar.series-5')).toContain('inherit');
      await page.hover('rect.bar.series-6');
      await page.waitForTimeout(100);
      expect(await checkCursor('rect.bar.series-6')).toContain('inherit');
    });

    it('should not able to tab through the legends', async () => {
      // eslint-disable-next-line
      await page.click('#btn-toggle-legend');
      const legendTabIndex = await page.$$eval('.chart-legend-item', e => e.map(el => el.tabIndex));
      expect(legendTabIndex).toEqual([-1]); // These are the values of tabindex of all the legends.
    });

    it('should not highlight when selected', async () => {
      const elHandleArray = await page.$$('rect.bar');
      const isFailed = [];
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        await eL.hover();
        await page.click(`rect.bar.series-${index}`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue('rect.bar.series-0', 'bar series-0'));
        isFailed.push(await checkClassNameValue('rect.bar.series-1', 'bar series-1'));
        isFailed.push(await checkClassNameValue('rect.bar.series-2', 'bar series-2'));
        isFailed.push(await checkClassNameValue('rect.bar.series-3', 'bar series-3'));
        isFailed.push(await checkClassNameValue('rect.bar.series-4', 'bar series-4'));
        isFailed.push(await checkClassNameValue('rect.bar.series-5', 'bar series-5'));
        isFailed.push(await checkClassNameValue('rect.bar.series-6', 'bar series-6'));
        await page.click(`rect.bar.series-${index}`);
        await page.waitForTimeout(200);
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });
});
