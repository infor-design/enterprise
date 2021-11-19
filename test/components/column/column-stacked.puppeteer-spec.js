const { checkIfElementExist, checkDataAutomationID, checkTooltipValue, checkClassNameValue, checkIfElementHasFocused } = require('../../helpers/e2e-utils.js');

describe('Column Stacked Chart Puppeteer Tests', () => {
  describe('Column Stacked Contextmenu tests', () => {
    const url = 'http://localhost:4000/components/column-stacked/example-contextmenu.html';

    beforeAll(async () => {
      await page.setViewport({
        width: 1200,
        height: 800,
        deviceScaleFactor: 1,
      });
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show context menu', async () => {
      const contextmenu = '#action-popupmenu.popupmenu.is-open';
      const actionOne = 'li.is-focused > a';
      // Stack  1
      const isFailed = [];
      const stackGroup = await page.$$('g [data-group-id="0"] > rect.bar');
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of stackGroup) {
        if (index === 12) { break; }
        await eL.hover();
        await page.click(`g [data-group-id="0"] > rect.series-${index}`, { button: 'right' });
        isFailed.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        isFailed.push(!await checkIfElementExist(contextmenu));
        index += 1;
      }
      expect(isFailed).not.toContain(true);

      // Stack  2
      const isFailed2 = [];
      const stackGroup2 = await page.$$('g [data-group-id="1"] > rect.bar');
      let index2 = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of stackGroup2) {
        if (index2 === 12) { break; }
        await eL.hover();
        await page.click(`g [data-group-id="1"] > rect.series-${index2}`, { button: 'right' });
        isFailed2.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        isFailed2.push(!await checkIfElementExist(contextmenu));
        index2 += 1;
      }
      expect(isFailed2).not.toContain(true);

      // Stack  3
      const isFailed3 = [];
      const stackGroup3 = await page.$$('g [data-group-id="2"] > rect.bar');
      let index3 = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of stackGroup3) {
        if (index3 === 12) { break; }
        await eL.hover();
        await page.click(`g [data-group-id="2"] > rect.series-${index3}`, { button: 'right' });
        isFailed3.push(await checkIfElementExist(contextmenu));
        await page.click(actionOne);
        isFailed3.push(!await checkIfElementExist(contextmenu));
        index3 += 1;
      }
      expect(isFailed3).not.toContain(true);
    });
  });

  describe('Column Stacked Disable Selection  State tests', () => {
    const url = 'http://localhost:4000/components/column-stacked/example-disable-selection-state.html';

    beforeAll(async () => {
      await page.setViewport({
        width: 1200,
        height: 800,
        deviceScaleFactor: 1,
      });
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to set id/automation id', async () => {
      const isFailed = [];

      const stackGroup = await page.$$('.series-group');
      let year = 2018;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of stackGroup) {
        await eL.hover();
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-jan-bar`, `automation-id-columnstacked-${year}-jan-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-feb-bar`, `automation-id-columnstacked-${year}-feb-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-mar-bar`, `automation-id-columnstacked-${year}-mar-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-apr-bar`, `automation-id-columnstacked-${year}-apr-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-may-bar`, `automation-id-columnstacked-${year}-may-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-jun-bar`, `automation-id-columnstacked-${year}-jun-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-jul-bar`, `automation-id-columnstacked-${year}-jul-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-aug-bar`, `automation-id-columnstacked-${year}-aug-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-sep-bar`, `automation-id-columnstacked-${year}-sep-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-oct-bar`, `automation-id-columnstacked-${year}-oct-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-nov-bar`, `automation-id-columnstacked-${year}-nov-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-dec-bar`, `automation-id-columnstacked-${year}-dec-bar`));
        await page.waitForTimeout(200);
        year -= 1;
      }
      // Legends
      isFailed.push(await checkDataAutomationID('#columnstacked-2018-legend-0', 'automation-id-columnstacked-2018-legend-0'));
      isFailed.push(await checkDataAutomationID('#columnstacked-2017-legend-1', 'automation-id-columnstacked-2017-legend-1'));
      isFailed.push(await checkDataAutomationID('#columnstacked-2016-legend-2', 'automation-id-columnstacked-2016-legend-2'));

      expect(isFailed).not.toContain(true);
    });

    it('should show the tooltip with data on first stack', async () => {
      const tooltip = '#svg-tooltip';
      const tooltipContent = '#svg-tooltip .tooltip-content';
      const isFailed = [];
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-0', tooltip, tooltipContent, 'Jan\n\t2016\t32\n\t2017\t22\n\t2018\t12'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-1', tooltip, tooltipContent, 'Feb\n\t2016\t31\n\t2017\t21\n\t2018\t11'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-2', tooltip, tooltipContent, 'Mar\n\t2016\t34\n\t2017\t24\n\t2018\t14'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-3', tooltip, tooltipContent, 'Apr\n\t2016\t30\n\t2017\t20\n\t2018\t10'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-4', tooltip, tooltipContent, 'May\n\t2016\t34\n\t2017\t24\n\t2018\t14'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-5', tooltip, tooltipContent, 'Jun\n\t2016\t38\n\t2017\t28\n\t2018\t8'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-6', tooltip, tooltipContent, 'Jul\n\t2016\t37\n\t2017\t27\n\t2018\t7'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-7', tooltip, tooltipContent, 'Aug\n\t2016\t30\n\t2017\t20\n\t2018\t10'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-8', tooltip, tooltipContent, 'Sep\n\t2016\t39\n\t2017\t29\n\t2018\t9'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-9', tooltip, tooltipContent, 'Oct\n\t2016\t38\n\t2017\t28\n\t2018\t8'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-10', tooltip, tooltipContent, 'Nov\n\t2016\t30\n\t2017\t20\n\t2018\t10'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-11', tooltip, tooltipContent, 'Dec\n\t2016\t36\n\t2017\t26\n\t2018\t6'));
      expect(isFailed).not.toContain(true);
    });

    it('should show the tooltip with data on second stack', async () => {
      const tooltip = '#svg-tooltip';
      const tooltipContent = '#svg-tooltip .tooltip-content';
      const isFailed = [];
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-0', tooltip, tooltipContent, 'Jan\n\t2016\t32\n\t2017\t22\n\t2018\t12'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-1', tooltip, tooltipContent, 'Feb\n\t2016\t31\n\t2017\t21\n\t2018\t11'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-2', tooltip, tooltipContent, 'Mar\n\t2016\t34\n\t2017\t24\n\t2018\t14'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-3', tooltip, tooltipContent, 'Apr\n\t2016\t30\n\t2017\t20\n\t2018\t10'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-4', tooltip, tooltipContent, 'May\n\t2016\t34\n\t2017\t24\n\t2018\t14'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-5', tooltip, tooltipContent, 'Jun\n\t2016\t38\n\t2017\t28\n\t2018\t8'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-6', tooltip, tooltipContent, 'Jul\n\t2016\t37\n\t2017\t27\n\t2018\t7'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-7', tooltip, tooltipContent, 'Aug\n\t2016\t30\n\t2017\t20\n\t2018\t10'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-8', tooltip, tooltipContent, 'Sep\n\t2016\t39\n\t2017\t29\n\t2018\t9'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-9', tooltip, tooltipContent, 'Oct\n\t2016\t38\n\t2017\t28\n\t2018\t8'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-10', tooltip, tooltipContent, 'Nov\n\t2016\t30\n\t2017\t20\n\t2018\t10'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-11', tooltip, tooltipContent, 'Dec\n\t2016\t36\n\t2017\t26\n\t2018\t6'));
      expect(isFailed).not.toContain(true);
    });

    it('should show the tooltip with data on third stack', async () => {
      const tooltip = '#svg-tooltip';
      const tooltipContent = '#svg-tooltip .tooltip-content';
      const isFailed = [];
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-0', tooltip, tooltipContent, 'Jan\n\t2016\t32\n\t2017\t22\n\t2018\t12'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-1', tooltip, tooltipContent, 'Feb\n\t2016\t31\n\t2017\t21\n\t2018\t11'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-2', tooltip, tooltipContent, 'Mar\n\t2016\t34\n\t2017\t24\n\t2018\t14'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-3', tooltip, tooltipContent, 'Apr\n\t2016\t30\n\t2017\t20\n\t2018\t10'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-4', tooltip, tooltipContent, 'May\n\t2016\t34\n\t2017\t24\n\t2018\t14'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-5', tooltip, tooltipContent, 'Jun\n\t2016\t38\n\t2017\t28\n\t2018\t8'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-6', tooltip, tooltipContent, 'Jul\n\t2016\t37\n\t2017\t27\n\t2018\t7'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-7', tooltip, tooltipContent, 'Aug\n\t2016\t30\n\t2017\t20\n\t2018\t10'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-8', tooltip, tooltipContent, 'Sep\n\t2016\t39\n\t2017\t29\n\t2018\t9'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-9', tooltip, tooltipContent, 'Oct\n\t2016\t38\n\t2017\t28\n\t2018\t8'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-10', tooltip, tooltipContent, 'Nov\n\t2016\t30\n\t2017\t20\n\t2018\t10'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-11', tooltip, tooltipContent, 'Dec\n\t2016\t36\n\t2017\t26\n\t2018\t6'));
      expect(isFailed).not.toContain(true);
    });

    it('should not show pointer as a cursor', async () => {
      const checkCursor = async el => page.$eval(el, e => e.style.cursor);

      // Stack  1
      const stackGroup = await page.$$('g [data-group-id="0"] > rect.bar');
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of stackGroup) {
        if (index === 12) { break; }
        await eL.hover();
        await page.hover(`g [data-group-id="0"] > rect.series-${index}`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`g [data-group-id="0"] > rect.series-${index}`)).toContain('inherit');
        index += 1;
      }

      // Stack  2
      const stackGroup2 = await page.$$('g [data-group-id="1"] > rect.bar');
      let index2 = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of stackGroup2) {
        if (index2 === 12) { break; }
        await eL.hover();
        await page.hover(`g [data-group-id="1"] > rect.series-${index2}`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`g [data-group-id="1"] > rect.series-${index2}`)).toContain('inherit');
        index2 += 1;
      }

      // Stack  3
      const stackGroup3 = await page.$$('g [data-group-id="2"] > rect.bar');
      let index3 = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of stackGroup3) {
        if (index3 === 12) { break; }
        await eL.hover();
        await page.hover(`g [data-group-id="2"] > rect.series-${index3}`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`g [data-group-id="2"] > rect.series-${index3}`)).toContain('inherit');
        index3 += 1;
      }
    }, 10000);

    it('should not able to tab through the legends', async () => {
      // eslint-disable-next-line
      const legendTabIndex = await page.$$eval('.chart-legend-item', e => e.map(el => el.tabIndex));
      expect(legendTabIndex).toEqual([-1, -1, -1]); // These are the values of tabindex of all the legends.
    });

    it('should not highlight when selected', async () => {
      const isFailed = [];
      const stackGroup = await page.$$('g [data-group-id="0"] > rect.bar');
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of stackGroup) {
        if (index === 12) { break; }
        await eL.hover();
        await page.click(`g [data-group-id="0"] > rect.series-${index}`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(`g [data-group-id="0"] > rect.bar.series-${index}`, `series-${index} bar`));
        isFailed.push(await checkClassNameValue(`g [data-group-id="1"] > rect.bar.series-${index}`, `series-${index} bar`));
        isFailed.push(await checkClassNameValue(`g [data-group-id="2"] > rect.bar.series-${index}`, `series-${index} bar`));
        await page.click(`g [data-group-id="0"] > rect.series-${index}`);
        await page.waitForTimeout(200);
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    }, 10000);

    it('should not select bar group on click in legends', async () => {
      const elHandleArray = await page.$$('.chart-legend-item');
      const isFailed = [];
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        await eL.hover();
        await page.click(`[index-id="chart-legend-${index}"]`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-0`, 'series-0 bar'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-1`, 'series-1 bar'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-2`, 'series-2 bar'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-3`, 'series-3 bar'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-4`, 'series-4 bar'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-5`, 'series-5 bar'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-6`, 'series-6 bar'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-7`, 'series-7 bar'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-8`, 'series-8 bar'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-9`, 'series-9 bar'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-10`, 'series-10 bar'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-11`, 'series-11 bar'));

        await page.click(`[index-id="chart-legend-${index}"]`);
        await page.waitForTimeout(200);
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Column Stacked Index tests', () => {
    const url = 'http://localhost:4000/components/column-stacked/example-index.html';

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
      "name": "Stacked Column Chart Title",
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
      "name": "Jul",
      "role": "StaticText",
    },
    Object {
      "name": "Aug",
      "role": "StaticText",
    },
    Object {
      "name": "Sep",
      "role": "StaticText",
    },
    Object {
      "name": "Oct",
      "role": "StaticText",
    },
    Object {
      "name": "Nov",
      "role": "StaticText",
    },
    Object {
      "name": "Dec",
      "role": "StaticText",
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
      "name": "Highlight 2018",
      "role": "button",
    },
    Object {
      "name": "Highlight 2017",
      "role": "button",
    },
    Object {
      "name": "Highlight 2016",
      "role": "button",
    },
  ],
  "name": "IDS Enterprise",
  "role": "RootWebArea",
}
`);
    });

    it('should be able to set id/automation id', async () => {
      const isFailed = [];

      const stackGroup = await page.$$('.series-group');
      let year = 2018;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of stackGroup) {
        await eL.hover();
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-jan-bar`, `automation-id-columnstacked-${year}-jan-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-feb-bar`, `automation-id-columnstacked-${year}-feb-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-mar-bar`, `automation-id-columnstacked-${year}-mar-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-apr-bar`, `automation-id-columnstacked-${year}-apr-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-may-bar`, `automation-id-columnstacked-${year}-may-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-jun-bar`, `automation-id-columnstacked-${year}-jun-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-jul-bar`, `automation-id-columnstacked-${year}-jul-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-aug-bar`, `automation-id-columnstacked-${year}-aug-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-sep-bar`, `automation-id-columnstacked-${year}-sep-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-oct-bar`, `automation-id-columnstacked-${year}-oct-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-nov-bar`, `automation-id-columnstacked-${year}-nov-bar`));
        isFailed.push(await checkDataAutomationID(`#columnstacked-${year}-dec-bar`, `automation-id-columnstacked-${year}-dec-bar`));
        await page.waitForTimeout(200);
        year -= 1;
      }
      // Legends
      isFailed.push(await checkDataAutomationID('#columnstacked-2018-legend-0', 'automation-id-columnstacked-2018-legend-0'));
      isFailed.push(await checkDataAutomationID('#columnstacked-2017-legend-1', 'automation-id-columnstacked-2017-legend-1'));
      isFailed.push(await checkDataAutomationID('#columnstacked-2016-legend-2', 'automation-id-columnstacked-2016-legend-2'));

      expect(isFailed).not.toContain(true);
    });

    it('should show the tooltip with data on first stack', async () => {
      const tooltip = '#svg-tooltip';
      const tooltipContent = '#svg-tooltip .tooltip-content';
      const isFailed = [];
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-0', tooltip, tooltipContent, 'Jan\n\t2016\t32\n\t2017\t22\n\t2018\t12'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-1', tooltip, tooltipContent, 'Feb\n\t2016\t31\n\t2017\t21\n\t2018\t11'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-2', tooltip, tooltipContent, 'Mar\n\t2016\t34\n\t2017\t24\n\t2018\t14'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-3', tooltip, tooltipContent, 'Apr\n\t2016\t30\n\t2017\t20\n\t2018\t10'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-4', tooltip, tooltipContent, 'May\n\t2016\t34\n\t2017\t24\n\t2018\t14'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-5', tooltip, tooltipContent, 'Jun\n\t2016\t38\n\t2017\t28\n\t2018\t8'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-6', tooltip, tooltipContent, 'Jul\n\t2016\t37\n\t2017\t27\n\t2018\t7'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-7', tooltip, tooltipContent, 'Aug\n\t2016\t30\n\t2017\t20\n\t2018\t10'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-8', tooltip, tooltipContent, 'Sep\n\t2016\t39\n\t2017\t29\n\t2018\t9'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-9', tooltip, tooltipContent, 'Oct\n\t2016\t38\n\t2017\t28\n\t2018\t8'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-10', tooltip, tooltipContent, 'Nov\n\t2016\t30\n\t2017\t20\n\t2018\t10'));
      isFailed.push(await checkTooltipValue('g [data-group-id="0"] > rect.series-11', tooltip, tooltipContent, 'Dec\n\t2016\t36\n\t2017\t26\n\t2018\t6'));
      expect(isFailed).not.toContain(true);
    });

    it('should show the tooltip with data on second stack', async () => {
      const tooltip = '#svg-tooltip';
      const tooltipContent = '#svg-tooltip .tooltip-content';
      const isFailed = [];
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-0', tooltip, tooltipContent, 'Jan\n\t2016\t32\n\t2017\t22\n\t2018\t12'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-1', tooltip, tooltipContent, 'Feb\n\t2016\t31\n\t2017\t21\n\t2018\t11'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-2', tooltip, tooltipContent, 'Mar\n\t2016\t34\n\t2017\t24\n\t2018\t14'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-3', tooltip, tooltipContent, 'Apr\n\t2016\t30\n\t2017\t20\n\t2018\t10'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-4', tooltip, tooltipContent, 'May\n\t2016\t34\n\t2017\t24\n\t2018\t14'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-5', tooltip, tooltipContent, 'Jun\n\t2016\t38\n\t2017\t28\n\t2018\t8'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-6', tooltip, tooltipContent, 'Jul\n\t2016\t37\n\t2017\t27\n\t2018\t7'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-7', tooltip, tooltipContent, 'Aug\n\t2016\t30\n\t2017\t20\n\t2018\t10'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-8', tooltip, tooltipContent, 'Sep\n\t2016\t39\n\t2017\t29\n\t2018\t9'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-9', tooltip, tooltipContent, 'Oct\n\t2016\t38\n\t2017\t28\n\t2018\t8'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-10', tooltip, tooltipContent, 'Nov\n\t2016\t30\n\t2017\t20\n\t2018\t10'));
      isFailed.push(await checkTooltipValue('g [data-group-id="1"] > rect.series-11', tooltip, tooltipContent, 'Dec\n\t2016\t36\n\t2017\t26\n\t2018\t6'));
      expect(isFailed).not.toContain(true);
    });

    it('should show the tooltip with data on third stack', async () => {
      const tooltip = '#svg-tooltip';
      const tooltipContent = '#svg-tooltip .tooltip-content';
      const isFailed = [];
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-0', tooltip, tooltipContent, 'Jan\n\t2016\t32\n\t2017\t22\n\t2018\t12'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-1', tooltip, tooltipContent, 'Feb\n\t2016\t31\n\t2017\t21\n\t2018\t11'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-2', tooltip, tooltipContent, 'Mar\n\t2016\t34\n\t2017\t24\n\t2018\t14'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-3', tooltip, tooltipContent, 'Apr\n\t2016\t30\n\t2017\t20\n\t2018\t10'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-4', tooltip, tooltipContent, 'May\n\t2016\t34\n\t2017\t24\n\t2018\t14'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-5', tooltip, tooltipContent, 'Jun\n\t2016\t38\n\t2017\t28\n\t2018\t8'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-6', tooltip, tooltipContent, 'Jul\n\t2016\t37\n\t2017\t27\n\t2018\t7'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-7', tooltip, tooltipContent, 'Aug\n\t2016\t30\n\t2017\t20\n\t2018\t10'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-8', tooltip, tooltipContent, 'Sep\n\t2016\t39\n\t2017\t29\n\t2018\t9'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-9', tooltip, tooltipContent, 'Oct\n\t2016\t38\n\t2017\t28\n\t2018\t8'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-10', tooltip, tooltipContent, 'Nov\n\t2016\t30\n\t2017\t20\n\t2018\t10'));
      isFailed.push(await checkTooltipValue('g [data-group-id="2"] > rect.series-11', tooltip, tooltipContent, 'Dec\n\t2016\t36\n\t2017\t26\n\t2018\t6'));
      expect(isFailed).not.toContain(true);
    });

    it('should show pointer as a cursor', async () => {
      const checkCursor = async el => page.$eval(el, e => e.style.cursor);

      // Stack  1
      const stackGroup = await page.$$('g [data-group-id="0"] > rect.bar');
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of stackGroup) {
        if (index === 12) { break; }
        await eL.hover();
        await page.hover(`g [data-group-id="0"] > rect.series-${index}`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`g [data-group-id="0"] > rect.series-${index}`)).toContain('pointer');
        index += 1;
      }

      // Stack  2
      const stackGroup2 = await page.$$('g [data-group-id="1"] > rect.bar');
      let index2 = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of stackGroup2) {
        if (index2 === 12) { break; }
        await eL.hover();
        await page.hover(`g [data-group-id="1"] > rect.series-${index2}`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`g [data-group-id="1"] > rect.series-${index2}`)).toContain('pointer');
        index2 += 1;
      }

      // Stack  3
      const stackGroup3 = await page.$$('g [data-group-id="2"] > rect.bar');
      let index3 = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of stackGroup3) {
        if (index3 === 12) { break; }
        await eL.hover();
        await page.hover(`g [data-group-id="2"] > rect.series-${index3}`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`g [data-group-id="2"] > rect.series-${index3}`)).toContain('pointer');
        index3 += 1;
      }
    }, 10000);

    it('should be able to tab through the legends', async () => {
      // eslint-disable-next-line
      const legendTabIndex = await page.$$eval('.chart-legend-item', e => e.map(el => el.tabIndex));
      expect(legendTabIndex).toEqual([0, 0, 0]); // These are the values of tabindex of all the legends.
      await page.click('body.no-scroll');
      const yr2018 = '[index-id="chart-legend-0"]';
      const yr2017 = '[index-id="chart-legend-1"]';
      const yr2016 = '[index-id="chart-legend-2"]';
      const isFailed = [];
      await page.keyboard.press('Tab');
      isFailed.push(await checkIfElementHasFocused(yr2018));
      await page.keyboard.press('Tab');
      isFailed.push(await checkIfElementHasFocused(yr2017));
      await page.keyboard.press('Tab');
      isFailed.push(await checkIfElementHasFocused(yr2016));
      expect(isFailed).not.toContain(true);
    });

    it('should highlight when selected', async () => {
      const isFailed = [];
      const stackGroup = await page.$$('g [data-group-id="0"] > rect.bar');
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of stackGroup) {
        if (index === 12) { break; }
        await eL.hover();
        await page.click(`g [data-group-id="0"] > rect.series-${index}`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(`g [data-group-id="0"] > rect.bar.series-${index}`, `series-${index} bar is-selected`));
        isFailed.push(await checkClassNameValue(`g [data-group-id="1"] > rect.bar.series-${index}`, `series-${index} bar is-selected`));
        isFailed.push(await checkClassNameValue(`g [data-group-id="2"] > rect.bar.series-${index}`, `series-${index} bar is-selected`));
        await page.click(`g [data-group-id="0"] > rect.series-${index}`);
        await page.waitForTimeout(200);
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    }, 10000);

    it('should select bar group on click in legends', async () => {
      const elHandleArray = await page.$$('.chart-legend-item');
      const isFailed = [];
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        await eL.hover();
        await page.click(`[index-id="chart-legend-${index}"]`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-0`, 'series-0 bar is-selected'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-1`, 'series-1 bar is-selected'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-2`, 'series-2 bar is-selected'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-3`, 'series-3 bar is-selected'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-4`, 'series-4 bar is-selected'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-5`, 'series-5 bar is-selected'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-6`, 'series-6 bar is-selected'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-7`, 'series-7 bar is-selected'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-8`, 'series-8 bar is-selected'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-9`, 'series-9 bar is-selected'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-10`, 'series-10 bar is-selected'));
        isFailed.push(await checkClassNameValue(`g [data-group-id="${index}"] > rect.bar.series-11`, 'series-11 bar is-selected'));

        await page.click(`[index-id="chart-legend-${index}"]`);
        await page.waitForTimeout(200);
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Column Stacked example-selected tests', () => {
    const url = 'http://localhost:4000/components/column-stacked/example-selected.html';

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be highlighted when selected', async () => {
      const dec2018 = 'g [data-group-id="0"] > rect.series-11';
      const dec2017 = 'g [data-group-id="1"] > rect.series-11';
      const dec2016 = 'g [data-group-id="2"] > rect.series-11';

      const isFailed = [];
      isFailed.push(await checkClassNameValue(dec2018, 'series-11 bar is-selected'));
      isFailed.push(await checkClassNameValue(dec2017, 'series-11 bar is-selected'));
      isFailed.push(await checkClassNameValue(dec2016, 'series-11 bar is-selected'));

      expect(isFailed).not.toContain(true);
    });
  });

  describe('Column Stacked example-set-selected tests', () => {
    const url = 'http://localhost:4000/components/column-stacked/example-set-selected.html';

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be highlighted when selected', async () => {
      const dec2018 = 'g [data-group-id="0"] > rect.series-2';
      const dec2017 = 'g [data-group-id="1"] > rect.series-2';
      const dec2016 = 'g [data-group-id="2"] > rect.series-2';
      await page.click('#btn-set-selected');
      await page.waitForTimeout(200);
      const isFailed = [];
      isFailed.push(await checkClassNameValue(dec2018, 'series-2 bar is-selected'));
      isFailed.push(await checkClassNameValue(dec2017, 'series-2 bar is-selected'));
      isFailed.push(await checkClassNameValue(dec2016, 'series-2 bar is-selected'));

      // toggle selection
      await page.click('#btn-toggle-selection');
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue(dec2018, 'series-2 bar'));
      isFailed.push(await checkClassNameValue(dec2017, 'series-2 bar'));
      isFailed.push(await checkClassNameValue(dec2016, 'series-2 bar'));
      await page.waitForTimeout(200);
      await page.click('#btn-toggle-selection');
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue(dec2018, 'series-2 bar is-selected'));
      isFailed.push(await checkClassNameValue(dec2017, 'series-2 bar is-selected'));
      isFailed.push(await checkClassNameValue(dec2016, 'series-2 bar is-selected'));

      expect(isFailed).not.toContain(true);
    });
  });

  describe('Column Stacked example-singular-set-selected tests', () => {
    const url = 'http://localhost:4000/components/column-stacked/example-singular-set-selected.html';

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be highlighted when selected', async () => {
      await page.click('#btn-set-selected');
      await page.waitForTimeout(200);
      const isFailed = [];
      isFailed.push(await checkClassNameValue('rect.series-0', 'bar series-0 is-selected'));
      isFailed.push(await checkClassNameValue('rect.series-1', 'bar series-1'));
      isFailed.push(await checkClassNameValue('rect.series-2', 'bar series-2'));
      isFailed.push(await checkClassNameValue('rect.series-3', 'bar series-3'));
      isFailed.push(await checkClassNameValue('rect.series-4', 'bar series-4'));
      isFailed.push(await checkClassNameValue('rect.series-5', 'bar series-5'));
      isFailed.push(await checkClassNameValue('rect.series-6', 'bar series-6'));

      // toggle selection
      await page.click('#btn-toggle-selection');
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue('rect.series-0', 'bar series-0'));
      isFailed.push(await checkClassNameValue('rect.series-1', 'bar series-1'));
      isFailed.push(await checkClassNameValue('rect.series-2', 'bar series-2'));
      isFailed.push(await checkClassNameValue('rect.series-3', 'bar series-3'));
      isFailed.push(await checkClassNameValue('rect.series-4', 'bar series-4'));
      isFailed.push(await checkClassNameValue('rect.series-5', 'bar series-5'));
      isFailed.push(await checkClassNameValue('rect.series-6', 'bar series-6'));
      await page.waitForTimeout(200);
      await page.click('#btn-toggle-selection');
      await page.waitForTimeout(200);
      isFailed.push(await checkClassNameValue('rect.series-0', 'bar series-0 is-selected'));
      isFailed.push(await checkClassNameValue('rect.series-1', 'bar series-1'));
      isFailed.push(await checkClassNameValue('rect.series-2', 'bar series-2'));
      isFailed.push(await checkClassNameValue('rect.series-3', 'bar series-3'));
      isFailed.push(await checkClassNameValue('rect.series-4', 'bar series-4'));
      isFailed.push(await checkClassNameValue('rect.series-5', 'bar series-5'));
      isFailed.push(await checkClassNameValue('rect.series-6', 'bar series-6'));
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Column Stacked example-singular tests', () => {
    const url = 'http://localhost:4000/components/column-stacked/example-singular.html';

    beforeEach(async () => {
      await page.setViewport({
        width: 1200,
        height: 800,
        deviceScaleFactor: 1,
      });
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be highlighted when selected', async () => {
      // Stack  1
      const isFailed = [];
      const stackGroup = await page.$$('rect.bar');
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of stackGroup) {
        await eL.hover();
        await page.click(`rect.series-${index}`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(`rect.series-${index}`, `bar series-${index} is-selected`));
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });

    it('should show the tooltip with data', async () => {
      const tooltip = '#svg-tooltip';
      const tooltipContent = '#svg-tooltip .tooltip-content';
      const isFailed = [];
      isFailed.push(await checkTooltipValue('rect.series-0', tooltip, tooltipContent, '7 Automotive'));
      isFailed.push(await checkTooltipValue('rect.series-1', tooltip, tooltipContent, '10 Distribution'));
      isFailed.push(await checkTooltipValue('rect.series-2', tooltip, tooltipContent, '14 Equipment'));
      isFailed.push(await checkTooltipValue('rect.series-3', tooltip, tooltipContent, '10 Fashion'));
      isFailed.push(await checkTooltipValue('rect.series-4', tooltip, tooltipContent, '14 Food & Beverage'));
      isFailed.push(await checkTooltipValue('rect.series-5', tooltip, tooltipContent, '8 Healthcare'));
      isFailed.push(await checkTooltipValue('rect.series-6', tooltip, tooltipContent, '7 Other'));
      expect(isFailed).not.toContain(true);
    });
  });
});
