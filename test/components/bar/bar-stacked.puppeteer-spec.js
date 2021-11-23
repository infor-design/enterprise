const { checkDataAutomationID, checkTooltipValue, checkClassNameValue } = require('../../helpers/e2e-utils.js');

describe('Bar (Stacked) Chart  Puppeteer Tests', () => {
  describe('Bar (Stacked) Chart Disable Selection  State Tests', () => {
    const url = 'http://localhost:4000/components/bar-stacked/example-disable-selection-state.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to set id/automation id', async () => {
      const isFailed = [];
      // Series  1
      isFailed.push(await checkDataAutomationID('#barstacked-s1-2008-bar', 'automation-id-barstacked-s1-2008-bar'));
      isFailed.push(await checkDataAutomationID('#barstacked-s1-2009-bar', 'automation-id-barstacked-s1-2009-bar'));
      isFailed.push(await checkDataAutomationID('#barstacked-s1-2010-bar', 'automation-id-barstacked-s1-2010-bar'));

      // Series 2
      isFailed.push(await checkDataAutomationID('#barstacked-s2-2008-bar', 'automation-id-barstacked-s2-2008-bar'));
      isFailed.push(await checkDataAutomationID('#barstacked-s2-2009-bar', 'automation-id-barstacked-s2-2009-bar'));
      isFailed.push(await checkDataAutomationID('#barstacked-s2-2010-bar', 'automation-id-barstacked-s2-2010-bar'));

      // Legends
      isFailed.push(await checkDataAutomationID('#barstacked-series1-legend-0', 'automation-id-barstacked-series1-legend-0'));
      isFailed.push(await checkDataAutomationID('#barstacked-series2-legend-1', 'automation-id-barstacked-series2-legend-1'));

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

      isFailed.push(await checkTooltipValue('g:nth-child(3) > rect.bar.series-0', tooltip, tooltipContent, '358 Total\n\tSeries 1\t34%\n\tSeries 2\t66%'));
      isFailed.push(await checkTooltipValue('g:nth-child(3) > rect.bar.series-1', tooltip, tooltipContent, '501 Total\n\tSeries 1\t47%\n\tSeries 2\t53%'));
      isFailed.push(await checkTooltipValue('g:nth-child(3) > rect.bar.series-2', tooltip, tooltipContent, '918 Total\n\tSeries 1\t38%\n\tSeries 2\t62%'));

      isFailed.push(await checkTooltipValue('g:nth-child(4) > rect.bar.series-0', tooltip, tooltipContent, '358 Total\n\tSeries 1\t34%\n\tSeries 2\t66%'));
      isFailed.push(await checkTooltipValue('g:nth-child(4) > rect.bar.series-1', tooltip, tooltipContent, '501 Total\n\tSeries 1\t47%\n\tSeries 2\t53%'));
      await page.waitForTimeout(200);
      isFailed.push(await checkTooltipValue('g:nth-child(4) > rect.bar.series-2', tooltip, tooltipContent, '918 Total\n\tSeries 1\t38%\n\tSeries 2\t62%'));

      expect(isFailed).not.toContain(true);
    });

    it('should not show pointer as a cursor', async () => {
      const checkCursor = async el => page.$eval(el, e => e.style.cursor);
      // series 1
      await page.hover('g:nth-child(3) > rect.bar.series-0');
      await page.waitForTimeout(100);
      expect(await checkCursor('g:nth-child(3) > rect.bar.series-0')).toContain('inherit');
      await page.hover('g:nth-child(3) > rect.bar.series-1');
      await page.waitForTimeout(100);
      expect(await checkCursor('g:nth-child(3) > rect.bar.series-1')).toContain('inherit');
      await page.hover('g:nth-child(3) > rect.bar.series-2');
      await page.waitForTimeout(100);
      expect(await checkCursor('g:nth-child(3) > rect.bar.series-2')).toContain('inherit');

      // series 2
      await page.hover('g:nth-child(4) > rect.bar.series-0');
      await page.waitForTimeout(100);
      expect(await checkCursor('g:nth-child(3) > rect.bar.series-0')).toContain('inherit');
      await page.hover('g:nth-child(4) > rect.bar.series-1');
      await page.waitForTimeout(100);
      expect(await checkCursor('g:nth-child(3) > rect.bar.series-1')).toContain('inherit');
      await page.hover('g:nth-child(4) > rect.bar.series-2');
      await page.waitForTimeout(100);
      expect(await checkCursor('g:nth-child(3) > rect.bar.series-2')).toContain('inherit');
    });

    it('should not able to tab through the legends', async () => {
      // eslint-disable-next-line
        const legendTabIndex = await page.$$eval('.chart-legend-item', e => e.map(el => el.tabIndex));
      expect(legendTabIndex).toEqual([-1, -1]); // These are the values of tabindex of all the legends.
    });

    it('should not highlight when selected', async () => {
      const elHandleArray = await page.$$('svg > g [data-group-id="0"] > .bar');
      const isFailed = [];
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let year = '';
        await eL.hover();
        switch (index) {
          case 0:
            year = '2008';
            await page.click(`#barstacked-s1-${year}-bar`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s1-2008-bar', 'bar series-0'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2009-bar', 'bar series-1'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2010-bar', 'bar series-2'));
            await page.click(`#barstacked-s1-${year}-bar`);
            await page.waitForTimeout(200);
            break;
          case 1:
            year = '2009';
            await page.click(`#barstacked-s1-${year}-bar`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s1-2008-bar', 'bar series-0'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2009-bar', 'bar series-1'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2010-bar', 'bar series-2'));
            await page.click(`#barstacked-s1-${year}-bar`);
            await page.waitForTimeout(200);
            break;
          case 2:
            year = '2010';
            await page.click(`#barstacked-s1-${year}-bar`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s1-2008-bar', 'bar series-0'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2009-bar', 'bar series-1'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2010-bar', 'bar series-2'));
            await page.click(`#barstacked-s1-${year}-bar`);
            await page.waitForTimeout(200);
            break;

          default:
            console.warn('series-group element not found');
        }
        index += 1;
      }
      expect(isFailed).not.toContain(true);

      // Series 2
      const elHandleArray2 = await page.$$('svg > g [data-group-id="1"] > .bar');
      const isFailed2 = [];
      let index2 = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray2) {
        let year2 = '';
        await eL.hover();
        switch (index2) {
          case 0:
            year2 = '2008';
            await page.click(`#barstacked-s2-${year2}-bar`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s2-2008-bar', 'bar series-0'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2009-bar', 'bar series-1'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2010-bar', 'bar series-2'));
            await page.click(`#barstacked-s2-${year2}-bar`);
            await page.waitForTimeout(200);
            break;
          case 1:
            year2 = '2009';
            await page.click(`#barstacked-s2-${year2}-bar`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s2-2008-bar', 'bar series-0'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2009-bar', 'bar series-1'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2010-bar', 'bar series-2'));
            await page.click(`#barstacked-s2-${year2}-bar`);
            await page.waitForTimeout(200);
            break;
          case 2:
            year2 = '2010';
            await page.click(`#barstacked-s2-${year2}-bar`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s2-2008-bar', 'bar series-0'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2009-bar', 'bar series-1'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2010-bar', 'bar series-2'));
            await page.click(`#barstacked-s2-${year2}-bar`);
            await page.waitForTimeout(200);
            break;

          default:
            console.warn('series-group element not found');
        }
        index2 += 1;
      }
      expect(isFailed2).not.toContain(true);
    });

    it('should not select bar stack on click in legends', async () => {
      const elHandleArray = await page.$$('.chart-legend-item');
      const isFailed = [];
      let index = 0;

      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        await eL.hover();
        switch (index) {
          case 0:
            await page.click(`[index-id="chart-legend-${index}"]`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s1-2008-bar', 'bar series-0'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2009-bar', 'bar series-1'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2010-bar', 'bar series-2'));
            await page.click(`[index-id="chart-legend-${index}"]`);
            await page.waitForTimeout(200);
            break;
          case 1:
            await page.click(`[index-id="chart-legend-${index}"]`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s2-2008-bar', 'bar series-0'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2009-bar', 'bar series-1'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2010-bar', 'bar series-2'));
            await page.click(`[index-id="chart-legend-${index}"]`);
            await page.waitForTimeout(200);
            break;
          default:
            console.warn('chart-legend-item element not found');
        }
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });
});
