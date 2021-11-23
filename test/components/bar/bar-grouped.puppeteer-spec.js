const { checkDataAutomationID, checkTooltipValue, checkClassNameValue } = require('../../helpers/e2e-utils.js');

describe('Grouped Bar Chart Puppeteer Tests', () => {
  describe('Grouped Bar Chart Disable Selection  State Tests', () => {
    const url = 'http://localhost:4000/components/bar-grouped/example-disable-selection-state.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to set id/automation id', async () => {
      const isFailed = [];
      // Series Group 1
      isFailed.push(await checkDataAutomationID('#bargroup-a-jan-bar', 'automation-id-bargroup-a-jan-bar'));
      isFailed.push(await checkDataAutomationID('#bargroup-a-feb-bar', 'automation-id-bargroup-a-feb-bar'));
      isFailed.push(await checkDataAutomationID('#bargroup-a-mar-bar', 'automation-id-bargroup-a-mar-bar'));
      isFailed.push(await checkDataAutomationID('#bargroup-a-apr-bar', 'automation-id-bargroup-a-apr-bar'));
      // Series Group 2
      isFailed.push(await checkDataAutomationID('#bargroup-b-jan-bar', 'automation-id-bargroup-b-jan-bar'));
      isFailed.push(await checkDataAutomationID('#bargroup-b-feb-bar', 'automation-id-bargroup-b-feb-bar'));
      isFailed.push(await checkDataAutomationID('#bargroup-b-mar-bar', 'automation-id-bargroup-b-mar-bar'));
      isFailed.push(await checkDataAutomationID('#bargroup-b-apr-bar', 'automation-id-bargroup-b-apr-bar'));
      // Series Group 3
      isFailed.push(await checkDataAutomationID('#bargroup-c-jan-bar', 'automation-id-bargroup-c-jan-bar'));
      isFailed.push(await checkDataAutomationID('#bargroup-c-feb-bar', 'automation-id-bargroup-c-feb-bar'));
      isFailed.push(await checkDataAutomationID('#bargroup-c-mar-bar', 'automation-id-bargroup-c-mar-bar'));
      isFailed.push(await checkDataAutomationID('#bargroup-c-apr-bar', 'automation-id-bargroup-c-apr-bar'));
      // Legends
      isFailed.push(await checkDataAutomationID('#bargroup-a-jan-legend-0', 'automation-id-bargroup-a-jan-legend-0'));
      isFailed.push(await checkDataAutomationID('#bargroup-a-feb-legend-1', 'automation-id-bargroup-a-feb-legend-1'));
      isFailed.push(await checkDataAutomationID('#bargroup-a-mar-legend-2', 'automation-id-bargroup-a-mar-legend-2'));
      isFailed.push(await checkDataAutomationID('#bargroup-a-apr-legend-3', 'automation-id-bargroup-a-apr-legend-3'));

      expect(isFailed).not.toContain(true);
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

      isFailed.push(await checkTooltipValue('#bar-grouped-example > svg > g > g:nth-child(3)', tooltip, tooltipContent, 'Tooltip by attribute'));
      isFailed.push(await checkTooltipValue('#bar-grouped-example > svg > g > g:nth-child(4)', tooltip, tooltipContent, 'Tooltip by attribute'));
      isFailed.push(await checkTooltipValue('#bar-grouped-example > svg > g > g:nth-child(5)', tooltip, tooltipContent, 'Tooltip by attribute'));

      expect(isFailed).not.toContain(true);
    });

    it('should not show pointer as a cursor', async () => {
      const checkCursor = async el => page.$eval(el, e => e.style.cursor);
      // series 1
      await page.hover('#bargroup-a-jan-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-a-jan-bar')).toContain('inherit');
      await page.hover('#bargroup-a-feb-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-a-feb-bar')).toContain('inherit');
      await page.hover('#bargroup-a-mar-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-a-mar-bar')).toContain('inherit');
      await page.hover('#bargroup-a-apr-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-a-apr-bar')).toContain('inherit');

      // series 2
      await page.hover('#bargroup-b-jan-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-b-jan-bar')).toContain('inherit');
      await page.hover('#bargroup-b-feb-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-b-feb-bar')).toContain('inherit');
      await page.hover('#bargroup-b-mar-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-b-mar-bar')).toContain('inherit');
      await page.hover('#bargroup-b-apr-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-b-apr-bar')).toContain('inherit');

      // series 3
      await page.hover('#bargroup-c-jan-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-c-jan-bar')).toContain('inherit');
      await page.hover('#bargroup-c-feb-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-c-feb-bar')).toContain('inherit');
      await page.hover('#bargroup-c-mar-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-c-mar-bar')).toContain('inherit');
      await page.hover('#bargroup-c-apr-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-c-apr-bar')).toContain('inherit');
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
