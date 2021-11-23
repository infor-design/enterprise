const { checkDataAutomationID, checkTooltipValue, checkClassNameValue } = require('../../helpers/e2e-utils.js');

describe('Column Stacked Chart Puppeteer Tests', () => {
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
});
