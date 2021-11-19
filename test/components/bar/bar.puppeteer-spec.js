const { getComputedStyle, checkIfElementExist, checkDataAutomationID, checkTooltipValue, checkClassNameValue } = require('../../helpers/e2e-utils.js');

describe('Bar Chart Puppeteer Tests', () => {
  describe('Bar Chart example-colors tests', () => {
    const url = 'http://localhost:4000/components/bar/example-colors?theme=classic&mode=light&layout=nofrills';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should detect that first bar is blue', async () => {
      const blueEl = '.bar.series-0';
      const fill = await getComputedStyle(blueEl, 'fill');
      expect(fill).toBe('rgb(29, 95, 138)');
    });

    it('should detect that second bar is green', async () => {
      const greenEl = '.bar.series-0';
      const fill = await getComputedStyle(greenEl, 'fill');
      expect(fill).toBe('rgb(29, 95, 138)');
    });

    it('should detect that third bar is violet', async () => {
      const violEl = '.bar.series-0';
      const fill = await getComputedStyle(violEl, 'fill');
      expect(fill).toBe('rgb(29, 95, 138)');
    });
  });

  describe('Bar Chart Contextmenu Tests', () => {
    const url = 'http://localhost:4000/components/bar/example-contextmenu.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show context menu', async () => {
      const contextmenu = '#action-popupmenu.popupmenu.is-open';
      const actionOne = 'li.is-focused > a';
      const isFailed = [];

      // Series 1 bubbles
      const seriesGroup = await page.$$('g.series-group > rect.bar');
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of seriesGroup) {
        await eL.hover();
        await page.click(`g.series-group > rect.bar.series-${index}`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        isFailed.push(!await checkIfElementExist(contextmenu));
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Bar Chart Disable Selection  State Tests', () => {
    const url = 'http://localhost:4000/components/bar/example-disable-selection-state.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to set id/automation id', async () => {
      const isFailed = [];
      isFailed.push(await checkDataAutomationID('#bar-a-bar', 'automation-id-bar-a-bar'));
      isFailed.push(await checkDataAutomationID('#bar-b-bar', 'automation-id-bar-b-bar'));
      isFailed.push(await checkDataAutomationID('#bar-c-bar', 'automation-id-bar-c-bar'));
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
      // Series 1
      isFailed.push(await checkTooltipValue('#bar-a-bar', tooltip, tooltipContent, 'Tooltip by Data\nComponent A\nInformation'));
      isFailed.push(await checkTooltipValue('#bar-b-bar', tooltip, tooltipContent, 'Category B 372'));
      isFailed.push(await checkTooltipValue('#bar-c-bar', tooltip, tooltipContent, 'Category C 236.35'));
      expect(isFailed).not.toContain(true);
    });

    it('should not show pointer as a cursor', async () => {
      const checkCursor = async el => page.$eval(el, e => e.style.cursor);
      await page.hover('#bar-a-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bar-a-bar')).toContain('inherit');

      // bar b
      await page.hover('#bar-b-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bar-b-bar')).toContain('inherit');

      // bar c
      await page.hover('#bar-c-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bar-c-bar')).toContain('inherit');
    });

    it('should not select bar on click', async () => {
      const isFailed = [];
      const barA = '#bar-a-bar';
      const barB = '#bar-b-bar';
      const barC = '#bar-c-bar';

      await page.click('#bar-a-bar');
      await page.waitForTimeout(100);
      isFailed.push(await checkClassNameValue(barA, 'bar series-0'));
      isFailed.push(await checkClassNameValue(barB, 'bar series-1'));
      isFailed.push(await checkClassNameValue(barC, 'bar series-2'));
      await page.click('#bar-a-bar');
      await page.waitForTimeout(100);

      await page.click('#bar-b-bar');
      await page.waitForTimeout(100);
      isFailed.push(await checkClassNameValue(barA, 'bar series-0'));
      isFailed.push(await checkClassNameValue(barB, 'bar series-1'));
      isFailed.push(await checkClassNameValue(barC, 'bar series-2'));
      await page.click('#bar-b-bar');
      await page.waitForTimeout(100);

      await page.click('#bar-c-bar');
      await page.waitForTimeout(100);
      isFailed.push(await checkClassNameValue(barA, 'bar series-0'));
      isFailed.push(await checkClassNameValue(barB, 'bar series-1'));
      isFailed.push(await checkClassNameValue(barC, 'bar series-2'));
      await page.click('#bar-c-bar');
      await page.waitForTimeout(100);

      expect(isFailed).not.toContain(true);
    });
  });

  describe('Bar Chart Index Tests', () => {
    const url = 'http://localhost:4000/components/bar/example-index.html';

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
      "name": "Vertical Bar Chart Title",
      "role": "heading",
    },
    Object {
      "name": "0",
      "role": "StaticText",
    },
    Object {
      "name": "50",
      "role": "StaticText",
    },
    Object {
      "name": "100",
      "role": "StaticText",
    },
    Object {
      "name": "150",
      "role": "StaticText",
    },
    Object {
      "name": "200",
      "role": "StaticText",
    },
    Object {
      "name": "250",
      "role": "StaticText",
    },
    Object {
      "name": "300",
      "role": "StaticText",
    },
    Object {
      "name": "350",
      "role": "StaticText",
    },
    Object {
      "name": "400",
      "role": "StaticText",
    },
    Object {
      "name": "Category A",
      "role": "StaticText",
    },
    Object {
      "name": "Category B",
      "role": "StaticText",
    },
    Object {
      "name": "Category C",
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
      isFailed.push(await checkDataAutomationID('#bar-a-bar', 'automation-id-bar-a-bar'));
      isFailed.push(await checkDataAutomationID('#bar-b-bar', 'automation-id-bar-b-bar'));
      isFailed.push(await checkDataAutomationID('#bar-c-bar', 'automation-id-bar-c-bar'));
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
      // Series 1
      isFailed.push(await checkTooltipValue('#bar-a-bar', tooltip, tooltipContent, 'Tooltip by Data\nComponent A\nInformation'));
      isFailed.push(await checkTooltipValue('#bar-b-bar', tooltip, tooltipContent, 'Category B 372'));
      isFailed.push(await checkTooltipValue('#bar-c-bar', tooltip, tooltipContent, 'Category C 236.35'));
      expect(isFailed).not.toContain(true);
    });

    it('should show pointer as a cursor', async () => {
      await page.hover('#bar-a-bar');
      await page.waitForTimeout(100);
      const barA = await getComputedStyle('#bar-a-bar', 'cursor');
      expect(barA).toContain('pointer');

      // bar b
      await page.hover('#bar-b-bar');
      await page.waitForTimeout(100);
      const barB = await getComputedStyle('#bar-b-bar', 'cursor');
      expect(barB).toContain('pointer');

      // bar c
      await page.hover('#bar-c-bar');
      await page.waitForTimeout(100);
      const barC = await getComputedStyle('#bar-c-bar', 'cursor');
      expect(barC).toContain('pointer');
    });

    it('should select bar on click', async () => {
      const isFailed = [];
      const barA = '#bar-a-bar';
      const barB = '#bar-b-bar';
      const barC = '#bar-c-bar';

      await page.click('#bar-a-bar');
      await page.waitForTimeout(400);
      isFailed.push(await checkClassNameValue(barA, 'bar series-0 is-selected'));
      isFailed.push(await checkClassNameValue(barB, 'bar series-1'));
      isFailed.push(await checkClassNameValue(barC, 'bar series-2'));
      await page.click('#bar-a-bar');
      await page.waitForTimeout(400);

      await page.click('#bar-b-bar');
      await page.waitForTimeout(400);
      isFailed.push(await checkClassNameValue(barA, 'bar series-0'));
      isFailed.push(await checkClassNameValue(barB, 'bar series-1 is-selected'));
      isFailed.push(await checkClassNameValue(barC, 'bar series-2'));
      await page.click('#bar-b-bar');
      await page.waitForTimeout(400);

      await page.click('#bar-c-bar');
      await page.waitForTimeout(400);
      isFailed.push(await checkClassNameValue(barA, 'bar series-0'));
      isFailed.push(await checkClassNameValue(barB, 'bar series-1'));
      isFailed.push(await checkClassNameValue(barC, 'bar series-2 is-selected'));
      await page.click('#bar-c-bar');
      await page.waitForTimeout(400);

      expect(isFailed).not.toContain(true);
    });
  });

  describe('Bar Chart Long Text Tests', () => {
    const url = 'http://localhost:4000/components/bar/example-long-text.html';

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
      // Series 1
      isFailed.push(await checkTooltipValue('.bar.series-0', tooltip, tooltipContent, 'Requirements Exceeding Net Change 373'));
      isFailed.push(await checkTooltipValue('.bar.series-1', tooltip, tooltipContent, 'Schedules with Requirements Rejected 372'));
      isFailed.push(await checkTooltipValue('.bar.series-2', tooltip, tooltipContent, 'Open Premium Freight Authorization 236.35'));
      expect(isFailed).not.toContain(true);
    });

    it('should show pointer as a cursor', async () => {
      await page.hover('.bar.series-0');
      await page.waitForTimeout(100);
      const barA = await getComputedStyle('.bar.series-0', 'cursor');
      expect(barA).toContain('pointer');

      // bar b
      await page.hover('.bar.series-1');
      await page.waitForTimeout(100);
      const barB = await getComputedStyle('.bar.series-1', 'cursor');
      expect(barB).toContain('pointer');

      // bar c
      await page.hover('.bar.series-2');
      await page.waitForTimeout(100);
      const barC = await getComputedStyle('.bar.series-2', 'cursor');
      expect(barC).toContain('pointer');
    });

    it('should select bar on click', async () => {
      const isFailed = [];
      const barA = '.bar.series-0';
      const barB = '.bar.series-1';
      const barC = '.bar.series-2';

      await page.click('.bar.series-0');
      await page.waitForTimeout(400);
      isFailed.push(await checkClassNameValue(barA, 'bar series-0 is-selected'));
      isFailed.push(await checkClassNameValue(barB, 'bar series-1'));
      isFailed.push(await checkClassNameValue(barC, 'bar series-2'));
      await page.click('.bar.series-0');
      await page.waitForTimeout(400);

      await page.click('.bar.series-1');
      await page.waitForTimeout(400);
      isFailed.push(await checkClassNameValue(barA, 'bar series-0'));
      isFailed.push(await checkClassNameValue(barB, 'bar series-1 is-selected'));
      isFailed.push(await checkClassNameValue(barC, 'bar series-2'));
      await page.click('.bar.series-1');
      await page.waitForTimeout(400);

      await page.click('.bar.series-2');
      await page.waitForTimeout(400);
      isFailed.push(await checkClassNameValue(barA, 'bar series-0'));
      isFailed.push(await checkClassNameValue(barB, 'bar series-1'));
      isFailed.push(await checkClassNameValue(barC, 'bar series-2 is-selected'));
      await page.click('.bar.series-2');
      await page.waitForTimeout(400);

      expect(isFailed).not.toContain(true);
    });
  });

  describe('Bar Chart Example-Negative-Value tests', () => {
    const url = 'http://localhost:4000/components/bar/example-negative-value.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should have negative values', async () => {
      const valueEl = (await page.$$('.axis.x .tick .negative-value')).length;
      expect(valueEl).toBe(2);
    });
  });

  describe('Bar Chart example-selected tests', () => {
    const url = 'http://localhost:4000/components/bar/test-selected.html';

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should have greyed out bars when not selected', async () => {
      const notSelectedBarEl = await getComputedStyle('.bar.series-1', 'opacity');
      expect(notSelectedBarEl).toBe('0.6');
    });
  });

  describe('Bar Chart several on page tests', () => {
    const url = 'http://localhost:4000/components/bar/test-several-on-page?layout=nofrills';
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not overwritten labels', async () => {
      const checkText = async (id, index, textContent) => {
        const text = await page.$eval(`${id} > svg > g > g.axis.y > g:nth-child(${index}) > text`, e => e.textContent);
        expect(text).toEqual(textContent);
      };

      const barChart = await page.$$('.bar-chart svg');
      expect(barChart.length).toEqual(2);

      const example1 = await page.$$('#bar-example1 .axis.y .tick text');
      expect(example1.length).toEqual(3);

      const example2 = await page.$$('#bar-example2 .axis.y .tick text');
      expect(example2.length).toEqual(3);

      await checkText('#bar-example1', 2, 'Category A');
      await checkText('#bar-example1', 3, 'Category B');
      await checkText('#bar-example1', 4, 'Category C');

      await checkText('#bar-example2', 2, 'Category D');
      await checkText('#bar-example2', 3, 'Category E');
      await checkText('#bar-example2', 4, 'Category F');
    });
  });
});
