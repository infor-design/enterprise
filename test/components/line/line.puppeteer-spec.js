const { checkIfElementExist, checkTooltipValue, checkDataAutomationID, checkClassNameValue, checkIfElementHasFocused } = require('../../helpers/e2e-utils.js');

describe('Line Puppeteer Tests', () => {
  describe('Line Contextmenu Tests', () => {
    const url = 'http://localhost:4000/components/line/example-contextmenu.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show context menu', async () => {
      const contextmenu = '#action-popupmenu.popupmenu.is-open';
      const actionOne = 'li.is-focused > a';
      const isFailed = [];
      const lineGroup = await page.$$('.line-group');
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of lineGroup) {
        await eL.hover();
        await page.click(`g[data-group-id="${index}"]  > circle:nth-child(2)`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        isFailed.push(!await checkIfElementExist(contextmenu));
        await page.click(`g[data-group-id="${index}"]  > circle:nth-child(3)`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        isFailed.push(!await checkIfElementExist(contextmenu));
        await page.click(`g[data-group-id="${index}"]  > circle:nth-child(4)`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        isFailed.push(!await checkIfElementExist(contextmenu));
        await page.click(`g[data-group-id="${index}"]  > circle:nth-child(5)`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        isFailed.push(!await checkIfElementExist(contextmenu));
        await page.click(`g[data-group-id="${index}"]  > circle:nth-child(6)`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        isFailed.push(!await checkIfElementExist(contextmenu));
        await page.click(`g[data-group-id="${index}"]  > circle:nth-child(7)`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        isFailed.push(!await checkIfElementExist(contextmenu));
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Line example-custom-dots Tests', () => {
    const url = 'http://localhost:4000/components/line/example-custom-dots.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should have correct sizes', async () => {
      const isFailed = [];
      // Line A dots
      const lineAdots = await page.$$('g[data-group-id="0"] > circle');
      let LineAindex = 2;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of lineAdots) {
        await eL.hover();
        const dot = await page.$(`g[data-group-id="0"]  > circle:nth-child(${LineAindex})`);
        const dotbb = await dot.boundingBox();
        expect(dotbb.width).toBe(6);
        expect(dotbb.height).toBe(6);
        LineAindex += 1;
      }
      expect(isFailed).not.toContain(true);

      // Line B dots
      const lineBisFailed = [];
      const lineBdots = await page.$$('g[data-group-id="1"] > circle');
      let LineBindex = 2;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of lineBdots) {
        await eL.hover();
        const dot = await page.$(`g[data-group-id="0"]  > circle:nth-child(${LineBindex})`);
        const dotbb = await dot.boundingBox();
        expect(dotbb.width).toBe(6);
        expect(dotbb.height).toBe(6);
        LineBindex += 1;
      }
      expect(lineBisFailed).not.toContain(true);

      // Line C dots
      const lineCisFailed = [];
      const lineCdots = await page.$$('g[data-group-id="2"] > circle');
      let LineCindex = 2;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of lineCdots) {
        await eL.hover();
        const dot = await page.$(`g[data-group-id="2"]  > circle:nth-child(${LineCindex})`);
        const dotbb = await dot.boundingBox();
        expect(dotbb.width).toBe(6);
        expect(dotbb.height).toBe(6);
        LineCindex += 1;
      }
      expect(lineCisFailed).not.toContain(true);
    });
  });

  describe('Line Custom Tooltips page tests', () => {
    const url = 'http://localhost:4000/components/line/example-custom-tooltip.html';
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

    it('should display custom tooltip in LineA', async () => {
      const isFailed = [];
      isFailed.push(await checkTooltipValue('g[data-group-id="0"]  > circle:nth-child(2)', tooltip, tooltipContent, 'Custom Tooltip for Component A'));
      isFailed.push(await checkTooltipValue('g[data-group-id="0"]  > circle:nth-child(3)', tooltip, tooltipContent, 'Custom Tooltip'));
      isFailed.push(await checkTooltipValue('g[data-group-id="0"]  > circle:nth-child(4)', tooltip, tooltipContent, 'Custom Tooltip for Component A'));
      isFailed.push(await checkTooltipValue('g[data-group-id="0"]  > circle:nth-child(5)', tooltip, tooltipContent, 'Custom Tooltip for Component A'));
      isFailed.push(await checkTooltipValue('g[data-group-id="0"]  > circle:nth-child(6)', tooltip, tooltipContent, 'Custom Tooltip for Component A'));
      isFailed.push(await checkTooltipValue('g[data-group-id="0"]  > circle:nth-child(7)', tooltip, tooltipContent, 'Custom Tooltip for Component A'));
      expect(isFailed).not.toContain(true);
    });

    it('should display custom tooltip in LineB', async () => {
      const isFailed = [];
      isFailed.push(await checkTooltipValue('g[data-group-id="1"]  > circle:nth-child(2)', tooltip, tooltipContent, 'Jan 22'));
      isFailed.push(await checkTooltipValue('g[data-group-id="1"]  > circle:nth-child(3)', tooltip, tooltipContent, 'Feb 21'));
      isFailed.push(await checkTooltipValue('g[data-group-id="1"]  > circle:nth-child(4)', tooltip, tooltipContent, 'Mar 24'));
      isFailed.push(await checkTooltipValue('g[data-group-id="1"]  > circle:nth-child(5)', tooltip, tooltipContent, 'Apr 20'));
      isFailed.push(await checkTooltipValue('g[data-group-id="1"]  > circle:nth-child(6)', tooltip, tooltipContent, 'May 24'));
      isFailed.push(await checkTooltipValue('g[data-group-id="1"]  > circle:nth-child(7)', tooltip, tooltipContent, 'Jun 28'));
      expect(isFailed).not.toContain(true);
    });

    it('should display custom tooltip in LineC', async () => {
      const isFailed = [];
      isFailed.push(await checkTooltipValue('g[data-group-id="2"]  > circle:nth-child(2)', tooltip, tooltipContent, 'Jan 32'));
      isFailed.push(await checkTooltipValue('g[data-group-id="2"]  > circle:nth-child(3)', tooltip, tooltipContent, 'Feb 31'));
      isFailed.push(await checkTooltipValue('g[data-group-id="2"]  > circle:nth-child(4)', tooltip, tooltipContent, 'Mar 34'));
      isFailed.push(await checkTooltipValue('g[data-group-id="2"]  > circle:nth-child(5)', tooltip, tooltipContent, 'Apr 30'));
      isFailed.push(await checkTooltipValue('g[data-group-id="2"]  > circle:nth-child(6)', tooltip, tooltipContent, 'May 34'));
      isFailed.push(await checkTooltipValue('g[data-group-id="2"]  > circle:nth-child(7)', tooltip, tooltipContent, 'Jun 38'));
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Line Disable Selection  State Tests', () => {
    const url = 'http://localhost:4000/components/line/example-disable-selection-state.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to set id/automation id', async () => {
      const elHandleArray = await page.$$('.line-group');
      const isFailed = [];
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let comp = '';
        await eL.click();
        switch (index) {
          case 0: // Line A
            comp = 'a';
            break;
          case 1: // Line B
            comp = 'b';
            break;
          case 2: // Line C
            comp = 'c';
            break;
          default:
            console.warn('line-group element not found');
        }
        isFailed.push(await checkDataAutomationID(`#line-${comp}-jan-dot`, `automation-id-line-${comp}-jan-dot`));
        isFailed.push(await checkDataAutomationID(`#line-${comp}-feb-dot`, `automation-id-line-${comp}-feb-dot`));
        isFailed.push(await checkDataAutomationID(`#line-${comp}-mar-dot`, `automation-id-line-${comp}-mar-dot`));
        isFailed.push(await checkDataAutomationID(`#line-${comp}-apr-dot`, `automation-id-line-${comp}-apr-dot`));
        isFailed.push(await checkDataAutomationID(`#line-${comp}-may-dot`, `automation-id-line-${comp}-may-dot`));
        isFailed.push(await checkDataAutomationID(`#line-${comp}-jun-dot`, `automation-id-line-${comp}-jun-dot`));
        isFailed.push(await checkDataAutomationID(`#line-comp-${comp}-legend-${index}`, `automation-id-line-comp-${comp}-legend-${index}`));
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });

    it('should show the tooltip with data', async () => {
      const tooltip = '#svg-tooltip';
      const tooltipContent = '#svg-tooltip .tooltip-content';
      const elHandleArray = await page.$$('.line-group');
      const isFailed = [];
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        await eL.click();
        switch (index) {
          case 0: // Line A
            isFailed.push(await checkTooltipValue('#line-a-jan-dot', tooltip, tooltipContent, 'Jan 3,211'));
            isFailed.push(await checkTooltipValue('#line-a-feb-dot', tooltip, tooltipContent, 'Feb 3,111'));
            isFailed.push(await checkTooltipValue('#line-a-mar-dot', tooltip, tooltipContent, 'Mar 3,411'));
            isFailed.push(await checkTooltipValue('#line-a-apr-dot', tooltip, tooltipContent, 'Apr 3,011'));
            isFailed.push(await checkTooltipValue('#line-a-may-dot', tooltip, tooltipContent, 'May 3,411'));
            isFailed.push(await checkTooltipValue('#line-a-jun-dot', tooltip, tooltipContent, 'Jun 3,111'));
            break;
          case 1: // Line B
            isFailed.push(await checkTooltipValue('#line-b-jan-dot', tooltip, tooltipContent, 'Jan 2,211'));
            isFailed.push(await checkTooltipValue('#line-b-feb-dot', tooltip, tooltipContent, 'Feb 2,111'));
            isFailed.push(await checkTooltipValue('#line-b-mar-dot', tooltip, tooltipContent, 'Mar 2,411'));
            isFailed.push(await checkTooltipValue('#line-b-apr-dot', tooltip, tooltipContent, 'Apr 2,011'));
            isFailed.push(await checkTooltipValue('#line-b-may-dot', tooltip, tooltipContent, 'May 2,411'));
            isFailed.push(await checkTooltipValue('#line-b-jun-dot', tooltip, tooltipContent, 'Jun 2,811'));
            break;
          case 2: // Line C
            isFailed.push(await checkTooltipValue('#line-c-jan-dot', tooltip, tooltipContent, 'Jan 1,211'));
            isFailed.push(await checkTooltipValue('#line-c-feb-dot', tooltip, tooltipContent, 'Feb 1,111'));
            isFailed.push(await checkTooltipValue('#line-c-mar-dot', tooltip, tooltipContent, 'Mar 1,411'));
            isFailed.push(await checkTooltipValue('#line-c-apr-dot', tooltip, tooltipContent, 'Apr 1,011'));
            isFailed.push(await checkTooltipValue('#line-c-may-dot', tooltip, tooltipContent, 'May 1,411'));
            isFailed.push(await checkTooltipValue('#line-c-jun-dot', tooltip, tooltipContent, 'Jun 1,811'));
            break;
          default:
            console.warn('line-group element not found');
        }
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });

    it('should not show pointer as a cursor', async () => {
      const checkCursor = async el => page.$eval(el, e => e.style.cursor);
      const elHandleArray = await page.$$('.line-group');
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let comp = '';
        await eL.click();
        switch (index) {
          case 0: // Line A
            comp = 'a';
            break;
          case 1: // Line B
            comp = 'b';
            break;
          case 2: // Line C
            comp = 'c';
            break;
          default:
            console.warn('line-group element not found');
        }

        await page.hover(`#line-${comp}-jan-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#line-${comp}-jan-dot`)).toContain('inherit');
        await page.hover(`#line-${comp}-feb-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#line-${comp}-feb-dot`)).toContain('inherit');
        await page.hover(`#line-${comp}-mar-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#line-${comp}-mar-dot`)).toContain('inherit');
        await page.hover(`#line-${comp}-apr-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#line-${comp}-apr-dot`)).toContain('inherit');
        await page.hover(`#line-${comp}-may-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#line-${comp}-may-dot`)).toContain('inherit');
        await page.hover(`#line-${comp}-jun-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#line-${comp}-jun-dot`)).toContain('inherit');
        index += 1;
      }
    });

    it('should not able to tab through the legends', async () => {
      // eslint-disable-next-line
      const legendTabIndex = await page.$$eval('.chart-legend-item', e => e.map(el => el.tabIndex));
      expect(legendTabIndex).toEqual([-1, -1, -1]); // These are the values of tabindex of all the legends.
    });

    it('should not select line group on click', async () => {
      const elHandleArray = await page.$$('.line-group');
      const isFailed = [];
      let index = 0;
      const lineA = '#line-example > svg > g > g:nth-child(3)';
      const lineB = '#line-example > svg > g > g:nth-child(4)';
      const lineC = '#line-example > svg > g > g:nth-child(5)';
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let comp = '';
        await eL.click();
        switch (index) {
          case 0: // Line A
            comp = 'a';
            break;
          case 1: // Line B
            comp = 'b';
            break;
          case 2: // Line C
            comp = 'c';
            break;
          default:
            console.warn('line-group element not found');
        }
        await page.click(`#line-${comp}-jan-dot`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#line-${comp}-jan-dot`);
        await page.waitForTimeout(200);

        await page.click(`#line-${comp}-feb-dot`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#line-${comp}-feb-dot`);
        await page.waitForTimeout(200);

        await page.click(`#line-${comp}-mar-dot`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#line-${comp}-mar-dot`);
        await page.waitForTimeout(200);

        await page.click(`#line-${comp}-apr-dot`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#line-${comp}-apr-dot`);
        await page.waitForTimeout(200);

        await page.click(`#line-${comp}-may-dot`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#line-${comp}-may-dot`);
        await page.waitForTimeout(200);

        await page.click(`#line-${comp}-jun-dot`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#line-${comp}-jun-dot`);
        await page.waitForTimeout(200);
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    }, 10000);

    it('should not select line group on click in legends', async () => {
      const elHandleArray = await page.$$('.line-group');
      const isFailed = [];
      let index = 0;
      const lineA = '#line-example > svg > g > g:nth-child(3)';
      const lineB = '#line-example > svg > g > g:nth-child(4)';
      const lineC = '#line-example > svg > g > g:nth-child(5)';
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let comp = '';
        await eL.click();
        switch (index) {
          case 0: // Line A
            comp = 'a';
            break;
          case 1: // Line B
            comp = 'b';
            break;
          case 2: // Line C
            comp = 'c';
            break;
          default:
            console.warn('line-group element not found');
        }
        await page.click(`#line-comp-${comp}-legend-${index}`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#line-comp-${comp}-legend-${index}`);
        await page.waitForTimeout(200);
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Line Index Tests', () => {
    const url = 'http://localhost:4000/components/line/example-index.html';

    beforeAll(async () => {
      await page.setViewport({
        width: 1200,
        height: 800,
        deviceScaleFactor: 1,
      });
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
      "name": "Line Chart Title",
      "role": "heading",
    },
    Object {
      "name": "Jan",
      "role": "StaticText",
    },
    Object {
      "name": "Feb",
      "role": "StaticText",
    },
    Object {
      "name": "Mar",
      "role": "StaticText",
    },
    Object {
      "name": "Apr",
      "role": "StaticText",
    },
    Object {
      "name": "May",
      "role": "StaticText",
    },
    Object {
      "name": "Jun",
      "role": "StaticText",
    },
    Object {
      "name": "0.0k",
      "role": "StaticText",
    },
    Object {
      "name": "0.5k",
      "role": "StaticText",
    },
    Object {
      "name": "1.0k",
      "role": "StaticText",
    },
    Object {
      "name": "1.5k",
      "role": "StaticText",
    },
    Object {
      "name": "2.0k",
      "role": "StaticText",
    },
    Object {
      "name": "2.5k",
      "role": "StaticText",
    },
    Object {
      "name": "3.0k",
      "role": "StaticText",
    },
    Object {
      "name": "3.5k",
      "role": "StaticText",
    },
    Object {
      "name": "Highlight Component A",
      "role": "button",
    },
    Object {
      "name": "Highlight Component B",
      "role": "button",
    },
    Object {
      "name": "Highlight Component C",
      "role": "button",
    },
  ],
  "name": "IDS Enterprise",
  "role": "RootWebArea",
}
`);
    });

    it('should be able to set id/automation id', async () => {
      const elHandleArray = await page.$$('.line-group');
      const isFailed = [];
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let comp = '';
        await eL.click();
        switch (index) {
          case 0: // Line A
            comp = 'a';
            break;
          case 1: // Line B
            comp = 'b';
            break;
          case 2: // Line C
            comp = 'c';
            break;
          default:
            console.warn('line-group element not found');
        }
        isFailed.push(await checkDataAutomationID(`#line-${comp}-jan-dot`, `automation-id-line-${comp}-jan-dot`));
        isFailed.push(await checkDataAutomationID(`#line-${comp}-feb-dot`, `automation-id-line-${comp}-feb-dot`));
        isFailed.push(await checkDataAutomationID(`#line-${comp}-mar-dot`, `automation-id-line-${comp}-mar-dot`));
        isFailed.push(await checkDataAutomationID(`#line-${comp}-apr-dot`, `automation-id-line-${comp}-apr-dot`));
        isFailed.push(await checkDataAutomationID(`#line-${comp}-may-dot`, `automation-id-line-${comp}-may-dot`));
        isFailed.push(await checkDataAutomationID(`#line-${comp}-jun-dot`, `automation-id-line-${comp}-jun-dot`));
        isFailed.push(await checkDataAutomationID(`#line-comp-${comp}-legend-${index}`, `automation-id-line-comp-${comp}-legend-${index}`));
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });

    it('should show the tooltip with data', async () => {
      const tooltip = '#svg-tooltip';
      const tooltipContent = '#svg-tooltip .tooltip-content';
      const elHandleArray = await page.$$('.line-group');
      const isFailed = [];
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        await eL.click();
        switch (index) {
          case 0: // Line A
            isFailed.push(await checkTooltipValue('#line-a-jan-dot', tooltip, tooltipContent, 'Jan 3,211'));
            isFailed.push(await checkTooltipValue('#line-a-feb-dot', tooltip, tooltipContent, 'Feb 3,111'));
            isFailed.push(await checkTooltipValue('#line-a-mar-dot', tooltip, tooltipContent, 'Mar 3,411'));
            isFailed.push(await checkTooltipValue('#line-a-apr-dot', tooltip, tooltipContent, 'Apr 3,011'));
            isFailed.push(await checkTooltipValue('#line-a-may-dot', tooltip, tooltipContent, 'May 3,411'));
            isFailed.push(await checkTooltipValue('#line-a-jun-dot', tooltip, tooltipContent, 'Jun 3,111'));
            break;
          case 1: // Line B
            isFailed.push(await checkTooltipValue('#line-b-jan-dot', tooltip, tooltipContent, 'Jan 2,211'));
            isFailed.push(await checkTooltipValue('#line-b-feb-dot', tooltip, tooltipContent, 'Feb 2,111'));
            isFailed.push(await checkTooltipValue('#line-b-mar-dot', tooltip, tooltipContent, 'Mar 2,411'));
            isFailed.push(await checkTooltipValue('#line-b-apr-dot', tooltip, tooltipContent, 'Apr 2,011'));
            isFailed.push(await checkTooltipValue('#line-b-may-dot', tooltip, tooltipContent, 'May 2,411'));
            isFailed.push(await checkTooltipValue('#line-b-jun-dot', tooltip, tooltipContent, 'Jun 2,811'));
            break;
          case 2: // Line C
            isFailed.push(await checkTooltipValue('#line-c-jan-dot', tooltip, tooltipContent, 'Jan 1,211'));
            isFailed.push(await checkTooltipValue('#line-c-feb-dot', tooltip, tooltipContent, 'Feb 1,111'));
            isFailed.push(await checkTooltipValue('#line-c-mar-dot', tooltip, tooltipContent, 'Mar 1,411'));
            isFailed.push(await checkTooltipValue('#line-c-apr-dot', tooltip, tooltipContent, 'Apr 1,011'));
            isFailed.push(await checkTooltipValue('#line-c-may-dot', tooltip, tooltipContent, 'May 1,411'));
            isFailed.push(await checkTooltipValue('#line-c-jun-dot', tooltip, tooltipContent, 'Jun 1,811'));
            break;
          default:
            console.warn('line-group element not found');
        }
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });

    it('should show pointer as a cursor', async () => {
      const checkCursor = async el => page.$eval(el, e => e.style.cursor);
      const elHandleArray = await page.$$('.line-group');
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let comp = '';
        await eL.click();
        switch (index) {
          case 0: // Line A
            comp = 'a';
            break;
          case 1: // Line B
            comp = 'b';
            break;
          case 2: // Line C
            comp = 'c';
            break;
          default:
            console.warn('line-group element not found');
        }

        await page.hover(`#line-${comp}-jan-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#line-${comp}-jan-dot`)).toContain('pointer');
        await page.hover(`#line-${comp}-feb-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#line-${comp}-feb-dot`)).toContain('pointer');
        await page.hover(`#line-${comp}-mar-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#line-${comp}-mar-dot`)).toContain('pointer');
        await page.hover(`#line-${comp}-apr-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#line-${comp}-apr-dot`)).toContain('pointer');
        await page.hover(`#line-${comp}-may-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#line-${comp}-may-dot`)).toContain('pointer');
        await page.hover(`#line-${comp}-jun-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#line-${comp}-jun-dot`)).toContain('pointer');
        index += 1;
      }
    });

    it('should be able to tab through the legends', async () => {
      // eslint-disable-next-line
      const legendTabIndex = await page.$$eval('.chart-legend-item', e => e.map(el => el.tabIndex));
      expect(legendTabIndex).toEqual([0, 0, 0]); // These are the values of tabindex of all the legends.
      await page.click('body.no-scroll');
      const legendA = '#line-comp-a-legend-0';
      const legendB = '#line-comp-b-legend-1';
      const legendC = '#line-comp-c-legend-2';
      const isFailed = [];
      await page.keyboard.press('Tab');
      isFailed.push(await checkIfElementHasFocused(legendA));
      await page.keyboard.press('Tab');
      isFailed.push(await checkIfElementHasFocused(legendB));
      await page.keyboard.press('Tab');
      isFailed.push(await checkIfElementHasFocused(legendC));
      expect(isFailed).not.toContain(true);
    });

    it('should select line group on click', async () => {
      const elHandleArray = await page.$$('.line-group');
      const isFailed = [];
      let index = 0;
      const lineA = 'g[data-group-id="0"]';
      const lineB = '#line-example > svg > g > g:nth-child(4)';
      const lineC = '#line-example > svg > g > g:nth-child(5)';
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let comp = '';
        await eL.click();
        switch (index) {
          case 0: // Line A
            comp = 'a';
            await page.click(`#line-${comp}-jan-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group is-not-selected'));
            await page.click(`#line-${comp}-jan-dot`);
            await page.waitForTimeout(200);

            await page.click(`#line-${comp}-feb-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group is-not-selected'));
            await page.click(`#line-${comp}-feb-dot`);
            await page.waitForTimeout(200);

            await page.click(`#line-${comp}-mar-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group is-not-selected'));
            await page.click(`#line-${comp}-mar-dot`);
            await page.waitForTimeout(200);

            await page.click(`#line-${comp}-apr-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group is-not-selected'));
            await page.click(`#line-${comp}-apr-dot`);
            await page.waitForTimeout(200);

            await page.click(`#line-${comp}-may-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group is-not-selected'));
            await page.click(`#line-${comp}-may-dot`);
            await page.waitForTimeout(200);

            await page.click(`#line-${comp}-jun-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group is-not-selected'));
            await page.click(`#line-${comp}-jun-dot`);
            await page.waitForTimeout(200);
            break;
          case 1: // Line B
            comp = 'b';
            await page.click(`#line-${comp}-jan-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-selected'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group is-not-selected'));
            await page.click(`#line-${comp}-jan-dot`);
            await page.waitForTimeout(200);

            await page.click(`#line-${comp}-feb-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-selected'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group is-not-selected'));
            await page.click(`#line-${comp}-feb-dot`);
            await page.waitForTimeout(200);

            await page.click(`#line-${comp}-mar-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-selected'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group is-not-selected'));
            await page.click(`#line-${comp}-mar-dot`);
            await page.waitForTimeout(200);

            await page.click(`#line-${comp}-apr-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-selected'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group is-not-selected'));
            await page.click(`#line-${comp}-apr-dot`);
            await page.waitForTimeout(200);

            await page.click(`#line-${comp}-may-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-selected'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group is-not-selected'));
            await page.click(`#line-${comp}-may-dot`);
            await page.waitForTimeout(200);

            await page.click(`#line-${comp}-jun-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-selected'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group is-not-selected'));
            await page.click(`#line-${comp}-jun-dot`);
            await page.waitForTimeout(200);

            break;
          case 2: // Line C
            comp = 'c';
            await page.click(`#line-${comp}-jan-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group is-selected'));
            await page.click(`#line-${comp}-jan-dot`);
            await page.waitForTimeout(200);

            await page.click(`#line-${comp}-feb-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group is-selected'));
            await page.click(`#line-${comp}-feb-dot`);
            await page.waitForTimeout(200);

            await page.click(`#line-${comp}-mar-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group is-selected'));
            await page.click(`#line-${comp}-mar-dot`);
            await page.waitForTimeout(200);

            await page.click(`#line-${comp}-apr-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group is-selected'));
            await page.click(`#line-${comp}-apr-dot`);
            await page.waitForTimeout(200);

            await page.click(`#line-${comp}-may-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group is-selected'));
            await page.click(`#line-${comp}-may-dot`);
            await page.waitForTimeout(200);

            await page.click(`#line-${comp}-jun-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group is-selected'));
            await page.click(`#line-${comp}-jun-dot`);
            await page.waitForTimeout(200);

            break;
          default:
            console.warn('line-group element not found');
        }
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    }, 10000);

    it('should select line group on click in legends', async () => {
      const elHandleArray = await page.$$('.line-group');
      const isFailed = [];
      let index = 0;
      const lineA = '#line-example > svg > g > g:nth-child(3)';
      const lineB = '#line-example > svg > g > g:nth-child(4)';
      const lineC = '#line-example > svg > g > g:nth-child(5)';
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let comp = '';
        await eL.click();
        switch (index) {
          case 0: // Line A
            comp = 'a';
            await page.click(`#line-comp-${comp}-legend-${index}`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group'));
            await page.click(`#line-comp-${comp}-legend-${index}`);
            await page.waitForTimeout(200);
            break;
          case 1: // Line B
            comp = 'b';
            await page.click(`#line-comp-${comp}-legend-${index}`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-selected'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group is-not-selected'));
            await page.click(`#line-comp-${comp}-legend-${index}`);
            await page.waitForTimeout(200);
            break;
          case 2: // Line C
            comp = 'c';
            await page.click(`#line-comp-${comp}-legend-${index}`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineC, 'line-group is-selected'));
            await page.click(`#line-comp-${comp}-legend-${index}`);
            await page.waitForTimeout(200);
            break;
          default:
            console.warn('line-group element not found');
        }

        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Line Localization tests', () => {
    it('should Localize Numbers - en-US', async () => {
      const url2 = 'http://localhost:4000/components/line/example-localize.html';
      await page.goto(url2, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      const text1 = await page.$eval('g.y.axis > g:nth-child(2) > text', e => e.textContent);
      const text2 = await page.$eval('g.y.axis > g:nth-child(3) > text', e => e.textContent);
      const text3 = await page.$eval('g.y.axis > g:nth-child(4) > text', e => e.textContent);
      expect(text1).toEqual('0');
      expect(text2).toEqual('5,000');
      expect(text3).toEqual('10,000');
    });

    it('should Localize Numbers - de-DE', async () => {
      const url2 = 'http://localhost:4000/components/line/example-localize.html?locale=de-DE';
      await page.goto(url2, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      const text1 = await page.$eval('g.y.axis > g:nth-child(2) > text', e => e.textContent);
      const text2 = await page.$eval('g.y.axis > g:nth-child(3) > text', e => e.textContent);
      const text3 = await page.$eval('g.y.axis > g:nth-child(4) > text', e => e.textContent);
      expect(text1).toEqual('0');
      expect(text2).toEqual('5.000');
      expect(text3).toEqual('10.000');
    });
  });
});

