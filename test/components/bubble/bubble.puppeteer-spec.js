const { checkDataAutomationID, checkClassNameValue, checkTooltipValue, checkIfElementHasFocused, checkIfElementExist } = require('../../helpers/e2e-utils.js');

describe('Bubble Puppeteer Tests', () => {
  describe('Bubble Disable Selection  State Tests', () => {
    const url = 'http://localhost:4000/components/bubble/example-disable-selection-state.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to set id/automation id', async () => {
      const elHandleArray = await page.$$('.line-group');
      const isFailed = [];
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let series = '';
        await eL.click();
        switch (index) {
          case 0: // Series 1
            series = '1';
            break;
          case 1: // Series 2
            series = '2';
            break;
          default:
            console.warn('line-group element not found');
        }
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-jan-dot`, `automation-id-bubble-s${series}-jan-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-feb-dot`, `automation-id-bubble-s${series}-feb-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-mar-dot`, `automation-id-bubble-s${series}-mar-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-apr-dot`, `automation-id-bubble-s${series}-apr-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-may-dot`, `automation-id-bubble-s${series}-may-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-jun-dot`, `automation-id-bubble-s${series}-jun-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-jul-dot`, `automation-id-bubble-s${series}-jul-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-aug-dot`, `automation-id-bubble-s${series}-aug-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-sep-dot`, `automation-id-bubble-s${series}-sep-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-oct-dot`, `automation-id-bubble-s${series}-oct-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-nov-dot`, `automation-id-bubble-s${series}-nov-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-dec-dot`, `automation-id-bubble-s${series}-dec-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-series${series}-line`, `automation-id-bubble-series${series}-line`));
        isFailed.push(await checkDataAutomationID(`#bubble-series${series}-legend-${index}`, `automation-id-bubble-series${series}-legend-${index}`));

        index += 1;
      }
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
      isFailed.push(await checkTooltipValue('#bubble-s1-jan-dot', tooltip, tooltipContent, ' January\nSeries\tSeries 01\nRevenue\t5\nSold\t3\nMarket Share\t3%'));
      isFailed.push(await checkTooltipValue('#bubble-s1-feb-dot', tooltip, tooltipContent, ' February\nSeries\tSeries 01\nRevenue\t37\nSold\t5\nMarket Share\t9%'));
      isFailed.push(await checkTooltipValue('#bubble-s1-mar-dot', tooltip, tooltipContent, ' March\nSeries\tSeries 01\nRevenue\t10\nSold\t5.3\nMarket Share\t4%'));
      isFailed.push(await checkTooltipValue('#bubble-s1-apr-dot', tooltip, tooltipContent, ' April\nSeries\tSeries 01\nRevenue\t80\nSold\t6\nMarket Share\t10%'));
      await page.waitForTimeout(400); // added this to mitigate test flakiness
      isFailed.push(await checkTooltipValue('#bubble-s1-may-dot', tooltip, tooltipContent, ' May\nSeries\tSeries 01\nRevenue\t21\nSold\t4.8\nMarket Share\t4%'));
      isFailed.push(await checkTooltipValue('#bubble-s1-jun-dot', tooltip, tooltipContent, ' June\nSeries\tSeries 01\nRevenue\t72\nSold\t5.2\nMarket Share\t4%'));
      isFailed.push(await checkTooltipValue('#bubble-s1-jul-dot', tooltip, tooltipContent, ' July\nSeries\tSeries 01\nRevenue\t26\nSold\t8\nMarket Share\t6%'));
      isFailed.push(await checkTooltipValue('#bubble-s1-aug-dot', tooltip, tooltipContent, ' August\nSeries\tSeries 01\nRevenue\t71\nSold\t3.9\nMarket Share\t8%'));
      isFailed.push(await checkTooltipValue('#bubble-s1-sep-dot', tooltip, tooltipContent, ' September\nSeries\tSeries 01\nRevenue\t85\nSold\t8\nMarket Share\t2%'));
      isFailed.push(await checkTooltipValue('#bubble-s1-oct-dot', tooltip, tooltipContent, ' October\nSeries\tSeries 01\nRevenue\t52\nSold\t3\nMarket Share\t2%'));
      isFailed.push(await checkTooltipValue('#bubble-s1-nov-dot', tooltip, tooltipContent, ' November\nSeries\tSeries 01\nRevenue\t44\nSold\t5.9\nMarket Share\t3%'));
      isFailed.push(await checkTooltipValue('#bubble-s1-dec-dot', tooltip, tooltipContent, ' December\nSeries\tSeries 01\nRevenue\t110\nSold\t7\nMarket Share\t4%'));
      // Series 2
      isFailed.push(await checkTooltipValue('#bubble-s2-jan-dot', tooltip, tooltipContent, ' January\nSeries\tSeries 02\nRevenue\t9\nSold\t3.2\nMarket Share\t3%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-feb-dot', tooltip, tooltipContent, ' February\nSeries\tSeries 02\nRevenue\t12\nSold\t6.3\nMarket Share\t10%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-mar-dot', tooltip, tooltipContent, ' March\nSeries\tSeries 02\nRevenue\t65\nSold\t4\nMarket Share\t10%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-apr-dot', tooltip, tooltipContent, ' April\nSeries\tSeries 02\nRevenue\t27\nSold\t7\nMarket Share\t2%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-may-dot', tooltip, tooltipContent, ' May\nSeries\tSeries 02\nRevenue\t29\nSold\t8.5\nMarket Share\t4%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-jun-dot', tooltip, tooltipContent, ' June\nSeries\tSeries 02\nRevenue\t81\nSold\t3.9\nMarket Share\t8%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-jul-dot', tooltip, tooltipContent, ' July\nSeries\tSeries 02\nRevenue\t33\nSold\t4.1\nMarket Share\t7%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-aug-dot', tooltip, tooltipContent, ' August\nSeries\tSeries 02\nRevenue\t75\nSold\t4\nMarket Share\t3%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-sep-dot', tooltip, tooltipContent, ' September\nSeries\tSeries 02\nRevenue\t39\nSold\t7\nMarket Share\t4%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-oct-dot', tooltip, tooltipContent, ' October\nSeries\tSeries 02\nRevenue\t80\nSold\t2\nMarket Share\t3%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-nov-dot', tooltip, tooltipContent, ' November\nSeries\tSeries 02\nRevenue\t48\nSold\t6.2\nMarket Share\t2%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-dec-dot', tooltip, tooltipContent, ' December\nSeries\tSeries 02\nRevenue\t99\nSold\t4\nMarket Share\t2%'));
      expect(isFailed).not.toContain(true);
    }, 10000);

    it('should not show pointer as a cursor', async () => {
      const checkCursor = async el => page.$eval(el, e => e.style.cursor);
      const elHandleArray = await page.$$('.line-group');
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let series = '';
        await eL.click();
        switch (index) {
          case 0: // Series 1
            series = '1';
            break;
          case 1: // Series 2
            series = '2';
            break;
          default:
            console.warn('line-group element not found');
        }

        await page.hover(`#bubble-s${series}-jan-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-jan-dot`)).toContain('inherit');
        await page.hover(`#bubble-s${series}-feb-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-feb-dot`)).toContain('inherit');
        await page.hover(`#bubble-s${series}-mar-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-mar-dot`)).toContain('inherit');
        await page.hover(`#bubble-s${series}-apr-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-apr-dot`)).toContain('inherit');
        await page.hover(`#bubble-s${series}-may-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-may-dot`)).toContain('inherit');
        await page.hover(`#bubble-s${series}-jun-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-jun-dot`)).toContain('inherit');
        await page.hover(`#bubble-s${series}-jul-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-jul-dot`)).toContain('inherit');
        await page.hover(`#bubble-s${series}-aug-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-aug-dot`)).toContain('inherit');
        await page.hover(`#bubble-s${series}-sep-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-sep-dot`)).toContain('inherit');
        await page.hover(`#bubble-s${series}-oct-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-oct-dot`)).toContain('inherit');
        await page.hover(`#bubble-s${series}-nov-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-nov-dot`)).toContain('inherit');
        await page.hover(`#bubble-s${series}-dec-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-dec-dot`)).toContain('inherit');
        index += 1;
      }
    });

    it('should not able to tab through the legends', async () => {
      // eslint-disable-next-line
      const legendTabIndex = await page.$$eval('.chart-legend-item', e => e.map(el => el.tabIndex));
      expect(legendTabIndex).toEqual([-1, -1]); // These are the values of tabindex of all the legends.
    });

    it('should not select line group on click', async () => {
      const elHandleArray = await page.$$('.line-group');
      const isFailed = [];
      let index = 0;
      const lineA = '#bubble-example > svg > g > g:nth-child(3)';
      const lineB = '#bubble-example > svg > g > g:nth-child(4)';
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let series = '';
        await eL.click();
        switch (index) {
          case 0: // Series 1
            series = '1';
            break;
          case 1: // Series 2
            series = '2';
            break;
          default:
            console.warn('line-group element not found');
        }
        await page.click(`#bubble-s${series}-jan-dot`);
        await page.waitForTimeout(100);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        await page.click(`#bubble-s${series}-jan-dot`);
        await page.waitForTimeout(100);

        await page.click(`#bubble-s${series}-feb-dot`);
        await page.waitForTimeout(100);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        await page.click(`#bubble-s${series}-feb-dot`);
        await page.waitForTimeout(100);

        await page.click(`#bubble-s${series}-mar-dot`);
        await page.waitForTimeout(100);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        await page.click(`#bubble-s${series}-mar-dot`);
        await page.waitForTimeout(100);

        await page.click(`#bubble-s${series}-apr-dot`);
        await page.waitForTimeout(100);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        await page.click(`#bubble-s${series}-apr-dot`);
        await page.waitForTimeout(100);

        await page.click(`#bubble-s${series}-may-dot`);
        await page.waitForTimeout(100);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        await page.click(`#bubble-s${series}-may-dot`);
        await page.waitForTimeout(100);

        await page.click(`#bubble-s${series}-jun-dot`);
        await page.waitForTimeout(100);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        await page.click(`#bubble-s${series}-jun-dot`);
        await page.waitForTimeout(100);

        await page.click(`#bubble-s${series}-jul-dot`);
        await page.waitForTimeout(100);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        await page.click(`#bubble-s${series}-jul-dot`);
        await page.waitForTimeout(100);

        await page.click(`#bubble-s${series}-aug-dot`);
        await page.waitForTimeout(100);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        await page.click(`#bubble-s${series}-aug-dot`);
        await page.waitForTimeout(100);

        await page.click(`#bubble-s${series}-sep-dot`);
        await page.waitForTimeout(100);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        await page.click(`#bubble-s${series}-sep-dot`);
        await page.waitForTimeout(100);

        await page.click(`#bubble-s${series}-oct-dot`);
        await page.waitForTimeout(100);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        await page.click(`#bubble-s${series}-oct-dot`);
        await page.waitForTimeout(100);

        await page.click(`#bubble-s${series}-nov-dot`);
        await page.waitForTimeout(100);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        await page.click(`#bubble-s${series}-nov-dot`);
        await page.waitForTimeout(100);

        await page.click(`#bubble-s${series}-dec-dot`);
        await page.waitForTimeout(100);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        await page.click(`#bubble-s${series}-dec-dot`);
        await page.waitForTimeout(100);
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    }, 10000);

    it('should not select line group on click in legends', async () => {
      const elHandleArray = await page.$$('.line-group');
      const isFailed = [];
      let index = 0;
      const lineA = '#bubble-example > svg > g > g:nth-child(3)';
      const lineB = '#bubble-example > svg > g > g:nth-child(4)';
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let series = '';
        await eL.click();
        switch (index) {
          case 0: // Series 1
            series = '1';
            break;
          case 1: // Series 2
            series = '2';
            break;
          default:
            console.warn('line-group element not found');
        }
        await page.click(`#bubble-series${series}-legend-${index}`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        await page.click(`#bubble-series${series}-legend-${index}`);
        await page.waitForTimeout(200);
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Bubble Index Tests', () => {
    const url = 'http://localhost:4000/components/bubble/example-index.html';

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
      "name": "Bubble Chart Title",
      "role": "heading",
    },
    Object {
      "name": "0",
      "role": "StaticText",
    },
    Object {
      "name": "10",
      "role": "StaticText",
    },
    Object {
      "name": "20",
      "role": "StaticText",
    },
    Object {
      "name": "30",
      "role": "StaticText",
    },
    Object {
      "name": "40",
      "role": "StaticText",
    },
    Object {
      "name": "50",
      "role": "StaticText",
    },
    Object {
      "name": "60",
      "role": "StaticText",
    },
    Object {
      "name": "70",
      "role": "StaticText",
    },
    Object {
      "name": "80",
      "role": "StaticText",
    },
    Object {
      "name": "90",
      "role": "StaticText",
    },
    Object {
      "name": "100",
      "role": "StaticText",
    },
    Object {
      "name": "110",
      "role": "StaticText",
    },
    Object {
      "name": "0",
      "role": "StaticText",
    },
    Object {
      "name": "1",
      "role": "StaticText",
    },
    Object {
      "name": "2",
      "role": "StaticText",
    },
    Object {
      "name": "3",
      "role": "StaticText",
    },
    Object {
      "name": "4",
      "role": "StaticText",
    },
    Object {
      "name": "5",
      "role": "StaticText",
    },
    Object {
      "name": "6",
      "role": "StaticText",
    },
    Object {
      "name": "7",
      "role": "StaticText",
    },
    Object {
      "name": "8",
      "role": "StaticText",
    },
    Object {
      "name": "9",
      "role": "StaticText",
    },
    Object {
      "name": "Highlight Series 01",
      "role": "button",
    },
    Object {
      "name": "Highlight Series 02",
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
        let series = '';
        await eL.click();
        switch (index) {
          case 0: // Series 1
            series = '1';
            break;
          case 1: // Series 2
            series = '2';
            break;
          default:
            console.warn('line-group element not found');
        }
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-jan-dot`, `automation-id-bubble-s${series}-jan-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-feb-dot`, `automation-id-bubble-s${series}-feb-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-mar-dot`, `automation-id-bubble-s${series}-mar-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-apr-dot`, `automation-id-bubble-s${series}-apr-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-may-dot`, `automation-id-bubble-s${series}-may-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-jun-dot`, `automation-id-bubble-s${series}-jun-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-jul-dot`, `automation-id-bubble-s${series}-jul-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-aug-dot`, `automation-id-bubble-s${series}-aug-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-sep-dot`, `automation-id-bubble-s${series}-sep-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-oct-dot`, `automation-id-bubble-s${series}-oct-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-nov-dot`, `automation-id-bubble-s${series}-nov-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-s${series}-dec-dot`, `automation-id-bubble-s${series}-dec-dot`));
        isFailed.push(await checkDataAutomationID(`#bubble-series${series}-line`, `automation-id-bubble-series${series}-line`));
        isFailed.push(await checkDataAutomationID(`#bubble-series${series}-legend-${index}`, `automation-id-bubble-series${series}-legend-${index}`));

        index += 1;
      }
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
      isFailed.push(await checkTooltipValue('#bubble-s1-jan-dot', tooltip, tooltipContent, ' January\nSeries\tSeries 01\nRevenue\t5\nSold\t3\nMarket Share\t3%'));
      isFailed.push(await checkTooltipValue('#bubble-s1-feb-dot', tooltip, tooltipContent, ' February\nSeries\tSeries 01\nRevenue\t37\nSold\t5\nMarket Share\t9%'));
      isFailed.push(await checkTooltipValue('#bubble-s1-mar-dot', tooltip, tooltipContent, ' March\nSeries\tSeries 01\nRevenue\t10\nSold\t5.3\nMarket Share\t4%'));
      isFailed.push(await checkTooltipValue('#bubble-s1-apr-dot', tooltip, tooltipContent, ' April\nSeries\tSeries 01\nRevenue\t80\nSold\t6\nMarket Share\t10%'));
      await page.waitForTimeout(400); // added this to mitigate test flakiness
      isFailed.push(await checkTooltipValue('#bubble-s1-may-dot', tooltip, tooltipContent, ' May\nSeries\tSeries 01\nRevenue\t21\nSold\t4.8\nMarket Share\t4%'));
      isFailed.push(await checkTooltipValue('#bubble-s1-jun-dot', tooltip, tooltipContent, ' June\nSeries\tSeries 01\nRevenue\t72\nSold\t5.2\nMarket Share\t4%'));
      isFailed.push(await checkTooltipValue('#bubble-s1-jul-dot', tooltip, tooltipContent, ' July\nSeries\tSeries 01\nRevenue\t26\nSold\t8\nMarket Share\t6%'));
      isFailed.push(await checkTooltipValue('#bubble-s1-aug-dot', tooltip, tooltipContent, ' August\nSeries\tSeries 01\nRevenue\t71\nSold\t3.9\nMarket Share\t8%'));
      isFailed.push(await checkTooltipValue('#bubble-s1-sep-dot', tooltip, tooltipContent, ' September\nSeries\tSeries 01\nRevenue\t85\nSold\t8\nMarket Share\t2%'));
      isFailed.push(await checkTooltipValue('#bubble-s1-oct-dot', tooltip, tooltipContent, ' October\nSeries\tSeries 01\nRevenue\t52\nSold\t3\nMarket Share\t2%'));
      isFailed.push(await checkTooltipValue('#bubble-s1-nov-dot', tooltip, tooltipContent, ' November\nSeries\tSeries 01\nRevenue\t44\nSold\t5.9\nMarket Share\t3%'));
      isFailed.push(await checkTooltipValue('#bubble-s1-dec-dot', tooltip, tooltipContent, ' December\nSeries\tSeries 01\nRevenue\t110\nSold\t7\nMarket Share\t4%'));
      // Series 2
      isFailed.push(await checkTooltipValue('#bubble-s2-jan-dot', tooltip, tooltipContent, ' January\nSeries\tSeries 02\nRevenue\t9\nSold\t3.2\nMarket Share\t3%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-feb-dot', tooltip, tooltipContent, ' February\nSeries\tSeries 02\nRevenue\t12\nSold\t6.3\nMarket Share\t10%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-mar-dot', tooltip, tooltipContent, ' March\nSeries\tSeries 02\nRevenue\t65\nSold\t4\nMarket Share\t10%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-apr-dot', tooltip, tooltipContent, ' April\nSeries\tSeries 02\nRevenue\t27\nSold\t7\nMarket Share\t2%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-may-dot', tooltip, tooltipContent, ' May\nSeries\tSeries 02\nRevenue\t29\nSold\t8.5\nMarket Share\t4%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-jun-dot', tooltip, tooltipContent, ' June\nSeries\tSeries 02\nRevenue\t81\nSold\t3.9\nMarket Share\t8%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-jul-dot', tooltip, tooltipContent, ' July\nSeries\tSeries 02\nRevenue\t33\nSold\t4.1\nMarket Share\t7%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-aug-dot', tooltip, tooltipContent, ' August\nSeries\tSeries 02\nRevenue\t75\nSold\t4\nMarket Share\t3%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-sep-dot', tooltip, tooltipContent, ' September\nSeries\tSeries 02\nRevenue\t39\nSold\t7\nMarket Share\t4%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-oct-dot', tooltip, tooltipContent, ' October\nSeries\tSeries 02\nRevenue\t80\nSold\t2\nMarket Share\t3%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-nov-dot', tooltip, tooltipContent, ' November\nSeries\tSeries 02\nRevenue\t48\nSold\t6.2\nMarket Share\t2%'));
      isFailed.push(await checkTooltipValue('#bubble-s2-dec-dot', tooltip, tooltipContent, ' December\nSeries\tSeries 02\nRevenue\t99\nSold\t4\nMarket Share\t2%'));
      expect(isFailed).not.toContain(true);
    }, 10000);

    it('should show pointer as a cursor', async () => {
      const checkCursor = async el => page.$eval(el, e => e.style.cursor);
      const elHandleArray = await page.$$('.line-group');
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let series = '';
        await eL.click();
        switch (index) {
          case 0: // Series 1
            series = '1';
            break;
          case 1: // Series 2
            series = '2';
            break;
          default:
            console.warn('line-group element not found');
        }

        await page.hover(`#bubble-s${series}-jan-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-jan-dot`)).toContain('pointer');
        await page.hover(`#bubble-s${series}-feb-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-feb-dot`)).toContain('pointer');
        await page.hover(`#bubble-s${series}-mar-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-mar-dot`)).toContain('pointer');
        await page.hover(`#bubble-s${series}-apr-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-apr-dot`)).toContain('pointer');
        await page.hover(`#bubble-s${series}-may-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-may-dot`)).toContain('pointer');
        await page.hover(`#bubble-s${series}-jun-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-jun-dot`)).toContain('pointer');
        await page.hover(`#bubble-s${series}-jul-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-jul-dot`)).toContain('pointer');
        await page.hover(`#bubble-s${series}-aug-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-aug-dot`)).toContain('pointer');
        await page.hover(`#bubble-s${series}-sep-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-sep-dot`)).toContain('pointer');
        await page.hover(`#bubble-s${series}-oct-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-oct-dot`)).toContain('pointer');
        await page.hover(`#bubble-s${series}-nov-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-nov-dot`)).toContain('pointer');
        await page.hover(`#bubble-s${series}-dec-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#bubble-s${series}-dec-dot`)).toContain('pointer');
        index += 1;
      }
    });

    it('should be able to tab through the legends', async () => {
      // eslint-disable-next-line
      const legendTabIndex = await page.$$eval('.chart-legend-item', e => e.map(el => el.tabIndex));
      expect(legendTabIndex).toEqual([0, 0]); // These are the values of tabindex of all the legends.
      await page.click('body.no-scroll');
      const legendA = '#bubble-series1-legend-0';
      const legendB = '#bubble-series2-legend-1';
      const isFailed = [];
      await page.keyboard.press('Tab');
      isFailed.push(await checkIfElementHasFocused(legendA));
      await page.keyboard.press('Tab');
      isFailed.push(await checkIfElementHasFocused(legendB));
    });

    it('should select line group on click', async () => {
      const elHandleArray = await page.$$('.line-group');
      const isFailed = [];
      let index = 0;
      const lineA = '#bubble-example > svg > g > g:nth-child(3)';
      const lineB = '#bubble-example > svg > g > g:nth-child(4)';
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let series = '';
        await eL.click();
        switch (index) {
          case 0: // Line A
            series = '1';
            await page.click(`#bubble-s${series}-jan-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-not-selected'));
            await page.click(`#bubble-s${series}-jan-dot`);
            await page.waitForTimeout(200);

            await page.click(`#bubble-s${series}-feb-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-not-selected'));
            await page.click(`#bubble-s${series}-feb-dot`);
            await page.waitForTimeout(200);

            await page.click(`#bubble-s${series}-mar-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-not-selected'));
            await page.click(`#bubble-s${series}-mar-dot`);
            await page.waitForTimeout(200);

            await page.click(`#bubble-s${series}-apr-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-not-selected'));
            await page.click(`#bubble-s${series}-apr-dot`);
            await page.waitForTimeout(200);

            await page.click(`#bubble-s${series}-may-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-not-selected'));
            await page.click(`#bubble-s${series}-may-dot`);
            await page.waitForTimeout(200);

            await page.click(`#bubble-s${series}-jun-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-not-selected'));
            await page.click(`#bubble-s${series}-jun-dot`);
            await page.waitForTimeout(200);
            break;
          case 1: // Line B
            series = '2';
            await page.click(`#bubble-s${series}-jan-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-selected'));
            await page.click(`#bubble-s${series}-jan-dot`);
            await page.waitForTimeout(200);

            await page.click(`#bubble-s${series}-feb-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-selected'));
            await page.click(`#bubble-s${series}-feb-dot`);
            await page.waitForTimeout(200);

            await page.click(`#bubble-s${series}-mar-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-selected'));
            await page.click(`#bubble-s${series}-mar-dot`);
            await page.waitForTimeout(200);

            await page.click(`#bubble-s${series}-apr-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-selected'));
            await page.click(`#bubble-s${series}-apr-dot`);
            await page.waitForTimeout(200);

            await page.click(`#bubble-s${series}-may-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-selected'));
            await page.click(`#bubble-s${series}-may-dot`);
            await page.waitForTimeout(200);

            await page.click(`#bubble-s${series}-jun-dot`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-selected'));
            await page.click(`#bubble-s${series}-jun-dot`);
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
      const lineA = '#bubble-example > svg > g > g:nth-child(3)';
      const lineB = '#bubble-example > svg > g > g:nth-child(4)';
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let series = '';
        await eL.click();
        switch (index) {
          case 0: // Line A
            series = '1';
            await page.click(`#bubble-series${series}-legend-${index}`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-not-selected'));
            await page.click(`#bubble-series${series}-legend-${index}`);
            await page.waitForTimeout(200);
            break;
          case 1: // Line B
            series = '2';
            await page.click(`#bubble-series${series}-legend-${index}`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue(lineA, 'line-group is-not-selected'));
            isFailed.push(await checkClassNameValue(lineB, 'line-group is-selected'));
            await page.click(`#bubble-series${series}-legend-${index}`);
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

  describe('Bubble Contextmenu Tests', () => {
    const url = 'http://localhost:4000/components/bubble/example-contextmenu.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show context menu', async () => {
      const contextmenu = '#action-popupmenu.popupmenu.is-open';
      const actionOne = 'li.is-focused > a';
      const isFailed = [];

      // Series 1 bubbles
      const s1Bubbles = await page.$$('g:nth-child(3) > circle');
      let s1index = 2;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of s1Bubbles) {
        await eL.hover();
        await page.click(`g:nth-child(3) > circle:nth-child(${s1index})`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        isFailed.push(!await checkIfElementExist(contextmenu));
        s1index += 1;
      }
      expect(isFailed).not.toContain(true);

      // Series 2 bubbles
      const s2isFailed = [];
      const s2Bubbles = await page.$$('g:nth-child(4) > circle');
      let s2index = 2;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of s2Bubbles) {
        await eL.hover();
        await page.click(`g:nth-child(4) > circle:nth-child(${s2index})`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        isFailed.push(!await checkIfElementExist(contextmenu));
        s2index += 1;
      }
      expect(s2isFailed).not.toContain(true);
    });
  });
});
