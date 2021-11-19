const { getComputedStyle, checkIfElementExist, checkTooltipValue, checkClassNameValue, checkDataAutomationID } = require('../../helpers/e2e-utils.js');

describe('Column Chart Puppeteer Tests', () => {
  describe('Column example-colors tests', () => {
    const url = 'http://localhost:4000/components/column/example-colors.html';

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should detect that first bar is azure', async () => {
      const barEl = 'rect.bar.series-0';
      const fill = await getComputedStyle(barEl, 'fill');
      expect(fill).toBe('rgb(29, 95, 138)');
    });

    it('should detect that second bar is turquoise', async () => {
      const barEl = 'rect.bar.series-1';
      const fill = await getComputedStyle(barEl, 'fill');
      expect(fill).toBe('rgb(142, 209, 198)');
    });

    it('should detect that third bar is crimson', async () => {
      const barEl = 'rect.bar.series-2';
      const fill = await getComputedStyle(barEl, 'fill');
      expect(fill).toBe('rgb(218, 18, 23)');
    });

    it('should detect that fourth bar is lavender purple', async () => {
      const barEl = 'rect.bar.series-3';
      const fill = await getComputedStyle(barEl, 'fill');
      expect(fill).toBe('rgb(146, 121, 166)');
    });

    it('should detect that fifth bar is cobalt blue', async () => {
      const barEl = 'rect.bar.series-4';
      const fill = await getComputedStyle(barEl, 'fill');
      expect(fill).toBe('rgb(0, 84, 177)');
    });

    it('should detect that sixth bar is cobalt blue', async () => {
      const barEl = 'rect.bar.series-5';
      const fill = await getComputedStyle(barEl, 'fill');
      expect(fill).toBe('rgb(0, 84, 177)');
    });

    it('should detect that seventh bar is cobalt blue', async () => {
      const barEl = 'rect.bar.series-6';
      const fill = await getComputedStyle(barEl, 'fill');
      expect(fill).toBe('rgb(0, 84, 177)');
    });
  });

  describe('Column Contextmenu tests', () => {
    const url = 'http://localhost:4000/components/column/example-contextmenu.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show context menu', async () => {
      const contextmenu = '#action-popupmenu.popupmenu.is-open';
      const actionOne = 'li.is-focused > a';
      const isFailed = [];

      // Series  1
      const seriesGroup = await page.$$('rect.bar');
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of seriesGroup) {
        await eL.hover();
        await page.click(`rect.bar.series-${index}`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        isFailed.push(!await checkIfElementExist(contextmenu));
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });

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

  describe('Column Index tests', () => {
    const url = 'http://localhost:4000/components/column/example-index.html';

    beforeAll(async () => {
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
      "name": "Column Chart Example",
      "role": "heading",
    },
    Object {
      "name": "Automotive",
      "role": "StaticText",
    },
    Object {
      "name": "Distribution",
      "role": "StaticText",
    },
    Object {
      "name": "Equipment",
      "role": "StaticText",
    },
    Object {
      "name": "Fashion",
      "role": "StaticText",
    },
    Object {
      "name": "Food",
      "role": "StaticText",
    },
    Object {
      "name": "Healthcare",
      "role": "StaticText",
    },
    Object {
      "name": "Other",
      "role": "StaticText",
    },
    Object {
      "name": "0",
      "role": "StaticText",
    },
    Object {
      "name": "2",
      "role": "StaticText",
    },
    Object {
      "name": "4",
      "role": "StaticText",
    },
    Object {
      "name": "6",
      "role": "StaticText",
    },
    Object {
      "name": "8",
      "role": "StaticText",
    },
    Object {
      "name": "10",
      "role": "StaticText",
    },
    Object {
      "name": "12",
      "role": "StaticText",
    },
    Object {
      "name": "14",
      "role": "StaticText",
    },
  ],
  "name": "IDS Enterprise",
  "role": "RootWebArea",
}
`);
    });

    it('should be able to set id/automation id', async () => {
      const isFailed = [];
      isFailed.push(await checkDataAutomationID('#column-auto-bar', 'automation-id-column-auto-bar'));
      isFailed.push(await checkDataAutomationID('#column-dist-bar', 'automation-id-column-dist-bar'));
      isFailed.push(await checkDataAutomationID('#column-equip-bar', 'automation-id-column-equip-bar'));
      isFailed.push(await checkDataAutomationID('#column-fash-bar', 'automation-id-column-fash-bar'));
      isFailed.push(await checkDataAutomationID('#column-food-bar', 'automation-id-column-food-bar'));
      isFailed.push(await checkDataAutomationID('#column-health-bar', 'automation-id-column-health-bar'));
      isFailed.push(await checkDataAutomationID('#column-other-bar', 'automation-id-column-other-bar'));
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

      isFailed.push(await checkTooltipValue('rect.bar.series-0', tooltip, tooltipContent, 'Custom Tooltip - 7'));
      isFailed.push(await checkTooltipValue('rect.bar.series-1', tooltip, tooltipContent, '10 Distribution'));
      isFailed.push(await checkTooltipValue('rect.bar.series-2', tooltip, tooltipContent, '14 Equipment'));
      isFailed.push(await checkTooltipValue('rect.bar.series-3', tooltip, tooltipContent, '10 Fashion'));
      isFailed.push(await checkTooltipValue('rect.bar.series-4', tooltip, tooltipContent, '14 Food'));
      isFailed.push(await checkTooltipValue('rect.bar.series-5', tooltip, tooltipContent, '8 Healthcare'));
      isFailed.push(await checkTooltipValue('rect.bar.series-6', tooltip, tooltipContent, '7 Other'));
      expect(isFailed).not.toContain(true);
    });

    it('should show pointer as a cursor', async () => {
      const checkCursor = async el => page.$eval(el, e => e.style.cursor);
      // series 1
      await page.hover('rect.bar.series-0');
      await page.waitForTimeout(100);
      expect(await checkCursor('rect.bar.series-0')).toContain('pointer');
      await page.hover('rect.bar.series-1');
      await page.waitForTimeout(100);
      expect(await checkCursor('rect.bar.series-1')).toContain('pointer');
      await page.hover('rect.bar.series-2');
      await page.waitForTimeout(100);
      expect(await checkCursor('rect.bar.series-2')).toContain('pointer');
      await page.hover('rect.bar.series-3');
      await page.waitForTimeout(100);
      expect(await checkCursor('rect.bar.series-3')).toContain('pointer');
      await page.hover('rect.bar.series-4');
      await page.waitForTimeout(100);
      expect(await checkCursor('rect.bar.series-4')).toContain('pointer');
      await page.hover('rect.bar.series-5');
      await page.waitForTimeout(100);
      expect(await checkCursor('rect.bar.series-5')).toContain('pointer');
      await page.hover('rect.bar.series-6');
      await page.waitForTimeout(100);
      expect(await checkCursor('rect.bar.series-6')).toContain('pointer');
    });

    it('should highlight when selected', async () => {
      const elHandleArray = await page.$$('rect.bar');
      const isFailed = [];
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        await eL.hover();
        switch (index) {
          case 0:
            await page.click(`rect.bar.series-${index}`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('rect.bar.series-0', 'bar series-0 is-selected'));
            isFailed.push(await checkClassNameValue('rect.bar.series-1', 'bar series-1'));
            isFailed.push(await checkClassNameValue('rect.bar.series-2', 'bar series-2'));
            isFailed.push(await checkClassNameValue('rect.bar.series-3', 'bar series-3'));
            isFailed.push(await checkClassNameValue('rect.bar.series-4', 'bar series-4'));
            isFailed.push(await checkClassNameValue('rect.bar.series-5', 'bar series-5'));
            isFailed.push(await checkClassNameValue('rect.bar.series-6', 'bar series-6'));
            await page.click(`rect.bar.series-${index}`);
            await page.waitForTimeout(200);
            break;
          case 1:
            await page.click(`rect.bar.series-${index}`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('rect.bar.series-0', 'bar series-0'));
            isFailed.push(await checkClassNameValue('rect.bar.series-1', 'bar series-1 is-selected'));
            isFailed.push(await checkClassNameValue('rect.bar.series-2', 'bar series-2'));
            isFailed.push(await checkClassNameValue('rect.bar.series-3', 'bar series-3'));
            isFailed.push(await checkClassNameValue('rect.bar.series-4', 'bar series-4'));
            isFailed.push(await checkClassNameValue('rect.bar.series-5', 'bar series-5'));
            isFailed.push(await checkClassNameValue('rect.bar.series-6', 'bar series-6'));
            await page.click(`rect.bar.series-${index}`);
            await page.waitForTimeout(200);
            break;
          case 2:
            await page.click(`rect.bar.series-${index}`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('rect.bar.series-0', 'bar series-0'));
            isFailed.push(await checkClassNameValue('rect.bar.series-1', 'bar series-1'));
            isFailed.push(await checkClassNameValue('rect.bar.series-2', 'bar series-2 is-selected'));
            isFailed.push(await checkClassNameValue('rect.bar.series-3', 'bar series-3'));
            isFailed.push(await checkClassNameValue('rect.bar.series-4', 'bar series-4'));
            isFailed.push(await checkClassNameValue('rect.bar.series-5', 'bar series-5'));
            isFailed.push(await checkClassNameValue('rect.bar.series-6', 'bar series-6'));
            await page.click(`rect.bar.series-${index}`);
            await page.waitForTimeout(200);
            break;
          case 3:
            await page.click(`rect.bar.series-${index}`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('rect.bar.series-0', 'bar series-0'));
            isFailed.push(await checkClassNameValue('rect.bar.series-1', 'bar series-1'));
            isFailed.push(await checkClassNameValue('rect.bar.series-2', 'bar series-2'));
            isFailed.push(await checkClassNameValue('rect.bar.series-3', 'bar series-3 is-selected'));
            isFailed.push(await checkClassNameValue('rect.bar.series-4', 'bar series-4'));
            isFailed.push(await checkClassNameValue('rect.bar.series-5', 'bar series-5'));
            isFailed.push(await checkClassNameValue('rect.bar.series-6', 'bar series-6'));
            await page.click(`rect.bar.series-${index}`);
            await page.waitForTimeout(200);
            break;
          case 4:
            await page.click(`rect.bar.series-${index}`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('rect.bar.series-0', 'bar series-0'));
            isFailed.push(await checkClassNameValue('rect.bar.series-1', 'bar series-1'));
            isFailed.push(await checkClassNameValue('rect.bar.series-2', 'bar series-2'));
            isFailed.push(await checkClassNameValue('rect.bar.series-3', 'bar series-3'));
            isFailed.push(await checkClassNameValue('rect.bar.series-4', 'bar series-4 is-selected'));
            isFailed.push(await checkClassNameValue('rect.bar.series-5', 'bar series-5'));
            isFailed.push(await checkClassNameValue('rect.bar.series-6', 'bar series-6'));
            await page.click(`rect.bar.series-${index}`);
            await page.waitForTimeout(200);
            break;
          case 5:
            await page.click(`rect.bar.series-${index}`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('rect.bar.series-0', 'bar series-0'));
            isFailed.push(await checkClassNameValue('rect.bar.series-1', 'bar series-1'));
            isFailed.push(await checkClassNameValue('rect.bar.series-2', 'bar series-2'));
            isFailed.push(await checkClassNameValue('rect.bar.series-3', 'bar series-3'));
            isFailed.push(await checkClassNameValue('rect.bar.series-4', 'bar series-4'));
            isFailed.push(await checkClassNameValue('rect.bar.series-5', 'bar series-5 is-selected'));
            isFailed.push(await checkClassNameValue('rect.bar.series-6', 'bar series-6'));
            await page.click(`rect.bar.series-${index}`);
            await page.waitForTimeout(200);
            break;
          case 6:
            await page.click(`rect.bar.series-${index}`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('rect.bar.series-0', 'bar series-0'));
            isFailed.push(await checkClassNameValue('rect.bar.series-1', 'bar series-1'));
            isFailed.push(await checkClassNameValue('rect.bar.series-2', 'bar series-2'));
            isFailed.push(await checkClassNameValue('rect.bar.series-3', 'bar series-3'));
            isFailed.push(await checkClassNameValue('rect.bar.series-4', 'bar series-4'));
            isFailed.push(await checkClassNameValue('rect.bar.series-5', 'bar series-5'));
            isFailed.push(await checkClassNameValue('rect.bar.series-6', 'bar series-6 is-selected'));
            await page.click(`rect.bar.series-${index}`);
            await page.waitForTimeout(200);
            break;

          default:
            console.warn('bar element not found');
        }
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Column Legend tests', () => {
    const url = 'http://localhost:4000/components/column/example-legend.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to tab through the legends', async () => {
      // eslint-disable-next-line
      await page.click('#btn-toggle-legend');
      const legendTabIndex = await page.$$eval('.chart-legend-item', e => e.map(el => el.tabIndex));
      expect(legendTabIndex).toEqual([0]); // These are the values of tabindex of all the legends.
      await page.click('body.no-scroll');
      await page.keyboard.press('Tab');
      const legend = await page.$eval('.chart-legend-item', el => el === document.activeElement);
      expect(legend).toBe(true);
    });

    it('should highlight when selected', async () => {
      const isFailed = [];
      await page.click('.chart-legend-item');
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue('rect.bar.series-0', 'bar series-0 is-selected'));
      isFailed.push(await checkClassNameValue('rect.bar.series-1', 'bar series-1'));
      isFailed.push(await checkClassNameValue('rect.bar.series-2', 'bar series-2'));
      isFailed.push(await checkClassNameValue('rect.bar.series-3', 'bar series-3'));
      isFailed.push(await checkClassNameValue('rect.bar.series-4', 'bar series-4'));
      isFailed.push(await checkClassNameValue('rect.bar.series-5', 'bar series-5'));
      isFailed.push(await checkClassNameValue('rect.bar.series-6', 'bar series-6'));
      await page.click('.chart-legend-item');
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue('rect.bar.series-0', 'bar series-0'));
      isFailed.push(await checkClassNameValue('rect.bar.series-1', 'bar series-1'));
      isFailed.push(await checkClassNameValue('rect.bar.series-2', 'bar series-2'));
      isFailed.push(await checkClassNameValue('rect.bar.series-3', 'bar series-3'));
      isFailed.push(await checkClassNameValue('rect.bar.series-4', 'bar series-4'));
      isFailed.push(await checkClassNameValue('rect.bar.series-5', 'bar series-5'));
      isFailed.push(await checkClassNameValue('rect.bar.series-6', 'bar series-6'));
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Custom Tooltips page tests', () => {
    const url = 'http://localhost:4000/components/column/test-custom-tooltips.html';
    const tooltip = '#svg-tooltip';
    const tooltipContent = '#svg-tooltip .tooltip-content';
    beforeAll(async () => {
      await page.setViewport({
        width: 1200,
        height: 800,
        deviceScaleFactor: 1,
      });
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should display custom tooltip when hovering to all column nodes default method', async () => {
      const isFailed = [];
      isFailed.push(await checkTooltipValue('.bar.series-6', tooltip, tooltipContent, 'Name: Other\nValue: 7'));
      expect(isFailed).not.toContain(true);
    });

    it('should display custom tooltip when hovering to specific column node as string', async () => {
      const isFailed = [];
      isFailed.push(await checkTooltipValue('.bar.series-0', tooltip, tooltipContent, 'Info: Extra Info about New Automotive\nName: Auto\nValue: 7'));
      expect(isFailed).not.toContain(true);
    });

    it('should display custom tooltip when hovering to specific column node as method', async () => {
      const isFailed = [];
      isFailed.push(await checkTooltipValue('.bar.series-1', tooltip, tooltipContent, 'Name: Distribution\nShort Name: Dist\nValue: 10'));
      expect(isFailed).not.toContain(true);
    });

    it('should not display tooltip when hovering to specific column node', async () => {
      await page.hover('.bar.series-2');
      const isHidden = await page.$eval('#svg-tooltip.is-hidden', tooltipEl => tooltipEl !== null);
      expect(isHidden).toBe(true);

      await page.hover('.bar.series-4');
      const isFailed = [];
      await checkClassNameValue('#svg-tooltip', '.tooltip.top');
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Column empty tests', () => {
    const url = 'http://localhost:4000/components/column/test-empty.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the empty area', async () => {
      const emptyMessage = await page.$eval('.empty-message', msg => msg !== null);
      const emptyTitle = await page.$eval('.empty-title', e => e.textContent);
      expect(emptyMessage).toBe(true);
      expect(emptyTitle).toEqual('No Data Found');
    });
  });
});
