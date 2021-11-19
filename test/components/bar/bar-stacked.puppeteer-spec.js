const { checkIfElementExist, checkDataAutomationID, checkTooltipValue, checkClassNameValue, getComputedStyle } = require('../../helpers/e2e-utils.js');

describe('Bar (Stacked) Chart  Puppeteer Tests', () => {
  describe('Bar (Stacked) Chart  Contextmenu Tests', () => {
    const url = 'http://localhost:4000/components/bar-stacked/example-contextmenu.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show context menu', async () => {
      const contextmenu = '#action-popupmenu.popupmenu.is-open';
      const actionOne = 'li.is-focused > a';
      const isFailed = [];

      // Series  1
      const seriesGroup1 = await page.$$('#bar-stacked-example > svg > g > g:nth-child(3) > rect.bar');
      let index1 = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of seriesGroup1) {
        await eL.hover();
        await page.click(`#bar-stacked-example > svg > g > g:nth-child(3) > rect.bar.series-${index1}`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        isFailed.push(!await checkIfElementExist(contextmenu));
        index1 += 1;
      }

      // Series  2
      const seriesGroup2 = await page.$$('#bar-stacked-example > svg > g > g:nth-child(4) > rect.bar');
      let index2 = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of seriesGroup2) {
        await eL.hover();
        await page.click(`#bar-stacked-example > svg > g > g:nth-child(4) > rect.bar.series-${index2}`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        isFailed.push(!await checkIfElementExist(contextmenu));
        index2 += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });

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

  describe('Bar (Stacked) Chart Index tests', () => {
    const url = 'http://localhost:4000/components/bar-stacked/example-index.html';

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
    });

    it('should pass accessibility checks', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea).toMatchInlineSnapshot(`
Object {
  "children": Array [
    Object {
      "name": "Skip to Main Content",
      "role": "link",
    },
    Object {
      "level": 1,
      "name": "IDS Enterprise",
      "role": "heading",
    },
    Object {
      "haspopup": "menu",
      "name": "Header More Actions Button",
      "role": "combobox",
    },
    Object {
      "level": 2,
      "name": "Stacked Bar Chart Title",
      "role": "heading",
    },
    Object {
      "name": "0",
      "role": "StaticText",
    },
    Object {
      "name": "100",
      "role": "StaticText",
    },
    Object {
      "name": "200",
      "role": "StaticText",
    },
    Object {
      "name": "300",
      "role": "StaticText",
    },
    Object {
      "name": "400",
      "role": "StaticText",
    },
    Object {
      "name": "500",
      "role": "StaticText",
    },
    Object {
      "name": "600",
      "role": "StaticText",
    },
    Object {
      "name": "700",
      "role": "StaticText",
    },
    Object {
      "name": "800",
      "role": "StaticText",
    },
    Object {
      "name": "900",
      "role": "StaticText",
    },
    Object {
      "name": "1,000",
      "role": "StaticText",
    },
    Object {
      "name": "2008",
      "role": "StaticText",
    },
    Object {
      "name": "2009",
      "role": "StaticText",
    },
    Object {
      "name": "2010",
      "role": "StaticText",
    },
    Object {
      "name": "Highlight Series 1",
      "role": "button",
    },
    Object {
      "name": "Highlight Series 2",
      "role": "button",
    },
  ],
  "name": "IDS Enterprise",
  "role": "RootWebArea",
}
`);
    });

    it('should have names for the graphs', async () => {
      const namesEl = (await page.$$('.axis.y .tick text')).length;
      expect(namesEl).toBe(3);
    });

    it('should have bar groups', async () => {
      const groupEl = (await page.$$('.group .series-group')).length;
      expect(groupEl).toBe(2);
    });

    it('should highlight when selected', async () => {
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
            isFailed.push(await checkClassNameValue('#barstacked-s1-2008-bar', 'bar series-0 is-selected'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2009-bar', 'bar series-1'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2010-bar', 'bar series-2'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2008-bar', 'bar series-0 is-selected'));
            await page.click(`#barstacked-s1-${year}-bar`);
            await page.waitForTimeout(200);
            break;
          case 1:
            year = '2009';
            await page.click(`#barstacked-s1-${year}-bar`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s1-2008-bar', 'bar series-0'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2009-bar', 'bar series-1 is-selected'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2010-bar', 'bar series-2'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2009-bar', 'bar series-1 is-selected'));
            await page.click(`#barstacked-s1-${year}-bar`);
            await page.waitForTimeout(200);
            break;
          case 2:
            year = '2010';
            await page.click(`#barstacked-s1-${year}-bar`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s1-2008-bar', 'bar series-0'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2009-bar', 'bar series-1'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2010-bar', 'bar series-2 is-selected'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2010-bar', 'bar series-2 is-selected'));
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
            isFailed.push(await checkClassNameValue('#barstacked-s1-2008-bar', 'bar series-0 is-selected'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2009-bar', 'bar series-1'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2010-bar', 'bar series-2'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2008-bar', 'bar series-0 is-selected'));
            await page.click(`#barstacked-s2-${year2}-bar`);
            await page.waitForTimeout(200);
            break;
          case 1:
            year2 = '2009';
            await page.click(`#barstacked-s2-${year2}-bar`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s1-2008-bar', 'bar series-0'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2009-bar', 'bar series-1 is-selected'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2010-bar', 'bar series-2'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2009-bar', 'bar series-1 is-selected'));
            await page.click(`#barstacked-s2-${year2}-bar`);
            await page.waitForTimeout(200);
            break;
          case 2:
            year2 = '2010';
            await page.click(`#barstacked-s2-${year2}-bar`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s1-2008-bar', 'bar series-0'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2009-bar', 'bar series-1'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2010-bar', 'bar series-2 is-selected'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2010-bar', 'bar series-2 is-selected'));
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

    it('should select bar stack on click in legends', async () => {
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
            isFailed.push(await checkClassNameValue('#barstacked-s1-2008-bar', 'bar series-0 is-selected'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2009-bar', 'bar series-1 is-selected'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2010-bar', 'bar series-2 is-selected'));
            await page.click(`[index-id="chart-legend-${index}"]`);
            await page.waitForTimeout(200);
            break;
          case 1:
            await page.click(`[index-id="chart-legend-${index}"]`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s2-2008-bar', 'bar series-0 is-selected'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2009-bar', 'bar series-1 is-selected'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2010-bar', 'bar series-2 is-selected'));
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

    it('should show pointer as a cursor', async () => {
      const checkCursor = async el => getComputedStyle(el, 'cursor');
      // series 1
      await page.hover('g:nth-child(3) > rect.bar.series-0');
      await page.waitForTimeout(100);
      expect(await checkCursor('g:nth-child(3) > rect.bar.series-0')).toContain('pointer');
      await page.hover('g:nth-child(3) > rect.bar.series-1');
      await page.waitForTimeout(100);
      expect(await checkCursor('g:nth-child(3) > rect.bar.series-1')).toContain('pointer');
      await page.hover('g:nth-child(3) > rect.bar.series-2');
      await page.waitForTimeout(100);
      expect(await checkCursor('g:nth-child(3) > rect.bar.series-2')).toContain('pointer');

      // series 2
      await page.hover('g:nth-child(4) > rect.bar.series-0');
      await page.waitForTimeout(100);
      expect(await checkCursor('g:nth-child(3) > rect.bar.series-0')).toContain('pointer');
      await page.hover('g:nth-child(4) > rect.bar.series-1');
      await page.waitForTimeout(100);
      expect(await checkCursor('g:nth-child(3) > rect.bar.series-1')).toContain('pointer');
      await page.hover('g:nth-child(4) > rect.bar.series-2');
      await page.waitForTimeout(100);
      expect(await checkCursor('g:nth-child(3) > rect.bar.series-2')).toContain('pointer');
    });

    it('should able to tab through the legends', async () => {
      const legendTabIndex = await page.$$eval('.chart-legend-item', e => e.map(el => el.tabIndex));
      expect(legendTabIndex).toEqual([0, 0]); // These are the values of tabindex of all the legends.
    });
  });

  describe('Bar (Stacked) Chart 100% tests', () => {
    const url = 'http://localhost:4000/components/bar-stacked/example-stacked-100.html';

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to set id/automation id', async () => {
      const isFailed = [];
      // Series  1
      isFailed.push(await checkDataAutomationID('#barstacked-c1-2014-bar', 'automation-id-barstacked-c1-2014-bar'));
      isFailed.push(await checkDataAutomationID('#barstacked-c1-2015-bar', 'automation-id-barstacked-c1-2015-bar'));

      // Series 2
      isFailed.push(await checkDataAutomationID('#barstacked-c2-2014-bar', 'automation-id-barstacked-c2-2014-bar'));
      isFailed.push(await checkDataAutomationID('#barstacked-c2-2015-bar', 'automation-id-barstacked-c2-2015-bar'));

      // Legends
      isFailed.push(await checkDataAutomationID('#barstacked-comp1-legend-0', 'automation-id-barstacked-comp1-legend-0'));
      isFailed.push(await checkDataAutomationID('#barstacked-comp2-legend-1', 'automation-id-barstacked-comp2-legend-1'));

      expect(isFailed).not.toContain(true);
    });
  });

  describe('Bar (Stacked) Chart example-colors', () => {
    const url = 'http://localhost:4000/components/bar-stacked/example-stacked-colors.html';

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should detect that first bar is green', async () => {
      const barEl = 'svg > g [data-group-id="0"] > .bar.series-0';
      const fill = await getComputedStyle(barEl, 'fill');
      expect(fill).toBe('rgb(168, 225, 225)');
    });

    it('should detect that second bar is violet', async () => {
      const barEl = 'svg > g [data-group-id="1"] > .bar.series-0';
      const fill = await getComputedStyle(barEl, 'fill');
      expect(fill).toBe('rgb(121, 40, 225)');
    });
  });
});
