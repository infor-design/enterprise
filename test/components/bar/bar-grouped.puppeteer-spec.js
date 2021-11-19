const { checkIfElementExist, checkDataAutomationID, checkTooltipValue, checkClassNameValue, checkIfElementHasFocused, getComputedStyle } = require('../../helpers/e2e-utils.js');

describe('Grouped Bar Chart Puppeteer Tests', () => {
  describe('Grouped Bar Chart Contextmenu Tests', () => {
    const url = 'http://localhost:4000/components/bar-grouped/example-contextmenu.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show context menu', async () => {
      const contextmenu = '#action-popupmenu.popupmenu.is-open';
      const actionOne = 'li.is-focused > a';
      const isFailed = [];

      // Series Group 1
      const seriesGroup = await page.$$('g.series-group');
      let index = 3;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of seriesGroup) {
        await eL.hover();
        await page.click(`svg > g > g:nth-child(${index})`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        isFailed.push(!await checkIfElementExist(contextmenu));
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });

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

  describe('Grouped Bar Chart Index tests', () => {
    const url = 'http://localhost:4000/components/bar-grouped/example-index.html';

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
      "name": "Grouped Bar Chart Title",
      "role": "heading",
    },
    Object {
      "name": "0",
      "role": "StaticText",
    },
    Object {
      "name": "5",
      "role": "StaticText",
    },
    Object {
      "name": "10",
      "role": "StaticText",
    },
    Object {
      "name": "15",
      "role": "StaticText",
    },
    Object {
      "name": "20",
      "role": "StaticText",
    },
    Object {
      "name": "25",
      "role": "StaticText",
    },
    Object {
      "name": "30",
      "role": "StaticText",
    },
    Object {
      "name": "35",
      "role": "StaticText",
    },
    Object {
      "name": "Component A",
      "role": "StaticText",
    },
    Object {
      "name": "Component B",
      "role": "StaticText",
    },
    Object {
      "name": "Component C",
      "role": "StaticText",
    },
    Object {
      "name": "Highlight Jan",
      "role": "button",
    },
    Object {
      "name": "Highlight Feb",
      "role": "button",
    },
    Object {
      "name": "Highlight Mar",
      "role": "button",
    },
    Object {
      "name": "Highlight Apr",
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
      expect(groupEl).toBe(3);
    });

    it('should highlight when selected', async () => {
      const isFailed = [];
      const seriesA = '#bar-grouped-example > svg > g > g:nth-child(3)';
      const seriesB = '#bar-grouped-example > svg > g > g:nth-child(4)';
      const seriesC = '#bar-grouped-example > svg > g > g:nth-child(5)';

      // Series A
      await page.click(seriesA);
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue(seriesA, 'series-group is-selected'));
      isFailed.push(await checkClassNameValue(seriesB, 'series-group'));
      isFailed.push(await checkClassNameValue(seriesC, 'series-group'));
      await page.click(seriesA);
      await page.waitForTimeout(200);

      // Series B
      await page.click(seriesB);
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue(seriesA, 'series-group'));
      isFailed.push(await checkClassNameValue(seriesB, 'series-group is-selected'));
      isFailed.push(await checkClassNameValue(seriesC, 'series-group'));
      await page.click(seriesB);
      await page.waitForTimeout(200);

      // Series C
      await page.click(seriesC);
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue(seriesA, 'series-group'));
      isFailed.push(await checkClassNameValue(seriesB, 'series-group'));
      isFailed.push(await checkClassNameValue(seriesC, 'series-group is-selected'));
      await page.click(seriesC);
      await page.waitForTimeout(200);

      expect(isFailed).not.toContain(true);
    });

    it('should select bar group on click in legends', async () => {
      const elHandleArray = await page.$$('.chart-legend-item');
      const isFailed = [];
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let legend = '';
        await eL.hover();
        switch (index) {
          case 0:
            legend = 'jan';
            await page.click(`[index-id="chart-legend-${index}"]`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(`#bargroup-a-${legend}-bar`, `bar series-${index} is-selected`));
            isFailed.push(await checkClassNameValue(`#bargroup-b-${legend}-bar`, `bar series-${index} is-selected`));
            isFailed.push(await checkClassNameValue(`#bargroup-c-${legend}-bar`, `bar series-${index} is-selected`));
            await page.click(`[index-id="chart-legend-${index}"]`);
            await page.waitForTimeout(200);
            break;
          case 1:
            legend = 'feb';
            await page.click(`[index-id="chart-legend-${index}"]`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(`#bargroup-a-${legend}-bar`, `bar series-${index} is-selected`));
            isFailed.push(await checkClassNameValue(`#bargroup-b-${legend}-bar`, `bar series-${index} is-selected`));
            isFailed.push(await checkClassNameValue(`#bargroup-c-${legend}-bar`, `bar series-${index} is-selected`));
            await page.click(`[index-id="chart-legend-${index}"]`);
            await page.waitForTimeout(200);
            break;
          case 2:
            legend = 'mar';
            await page.click(`[index-id="chart-legend-${index}"]`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(`#bargroup-a-${legend}-bar`, `bar series-${index} is-selected`));
            isFailed.push(await checkClassNameValue(`#bargroup-b-${legend}-bar`, `bar series-${index} is-selected`));
            isFailed.push(await checkClassNameValue(`#bargroup-c-${legend}-bar`, `bar series-${index} is-selected`));
            await page.click(`[index-id="chart-legend-${index}"]`);
            await page.waitForTimeout(200);
            break;
          case 3:
            legend = 'apr';
            await page.click(`[index-id="chart-legend-${index}"]`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(`#bargroup-a-${legend}-bar`, `bar series-${index} is-selected`));
            isFailed.push(await checkClassNameValue(`#bargroup-b-${legend}-bar`, `bar series-${index} is-selected`));
            isFailed.push(await checkClassNameValue(`#bargroup-c-${legend}-bar`, `bar series-${index} is-selected`));
            await page.click(`[index-id="chart-legend-${index}"]`);
            await page.waitForTimeout(200);
            break;
          default:
            console.warn('series-group element not found');
        }
        index += 1;
      }

      expect(isFailed).not.toContain(true);
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

    it('should show pointer as a cursor', async () => {
      const checkCursor = async el => getComputedStyle(el, 'cursor');

      // series 1
      await page.hover('#bargroup-a-jan-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-a-jan-bar')).toContain('pointer');
      await page.hover('#bargroup-a-feb-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-a-feb-bar')).toContain('pointer');
      await page.hover('#bargroup-a-mar-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-a-mar-bar')).toContain('pointer');
      await page.hover('#bargroup-a-apr-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-a-apr-bar')).toContain('pointer');

      // series 2
      await page.hover('#bargroup-b-jan-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-b-jan-bar')).toContain('pointer');
      await page.hover('#bargroup-b-feb-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-b-feb-bar')).toContain('pointer');
      await page.hover('#bargroup-b-mar-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-b-mar-bar')).toContain('pointer');
      await page.hover('#bargroup-b-apr-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-b-apr-bar')).toContain('pointer');

      // series 3
      await page.hover('#bargroup-c-jan-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-c-jan-bar')).toContain('pointer');
      await page.hover('#bargroup-c-feb-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-c-feb-bar')).toContain('pointer');
      await page.hover('#bargroup-c-mar-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-c-mar-bar')).toContain('pointer');
      await page.hover('#bargroup-c-apr-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bargroup-c-apr-bar')).toContain('pointer');
    });

    it('should be able to tab through the legends', async () => {
      // eslint-disable-next-line
      const legendTabIndex = await page.$$eval('.chart-legend-item', e => e.map(el => el.tabIndex));
      expect(legendTabIndex).toEqual([0, 0, 0, 0]); // These are the values of tabindex of all the legends.
      await page.click('body.no-scroll');
      const jan = '[index-id="chart-legend-0"]';
      const feb = '[index-id="chart-legend-1"]';
      const mar = '[index-id="chart-legend-2"]';
      const apr = '[index-id="chart-legend-3"]';
      const isFailed = [];
      await page.keyboard.press('Tab');
      isFailed.push(await checkIfElementHasFocused(jan));
      await page.keyboard.press('Tab');
      isFailed.push(await checkIfElementHasFocused(feb));
      await page.keyboard.press('Tab');
      isFailed.push(await checkIfElementHasFocused(mar));
      await page.keyboard.press('Tab');
      isFailed.push(await checkIfElementHasFocused(apr));
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Grouped Bar Chart example-negative-value tests', () => {
    const url = 'http://localhost:4000/components/bar-grouped/example-negative.html';

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should have negative values', async () => {
      const valueEl = (await page.$$('.axis.x .tick .negative-value')).length;
      expect(valueEl).toBe(2);
    });
  });

  describe('Grouped Bar Chart example-selected tests', () => {
    const url = 'http://localhost:4000/components/bar-grouped/test-selected.html';

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be highlighted when selected', async () => {
      const elemHandle = await page.$('#bar-grouped-example > svg > g > g:nth-child(3)');
      const fGroupEl = await page.evaluate(elem => elem.getAttribute('class'), elemHandle);
      expect(fGroupEl).toContain('is-selected');
    });
  });
});
