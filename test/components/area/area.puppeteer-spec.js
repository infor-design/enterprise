const { checkDataAutomationID, checkClassNameValue, checkTooltipValue, checkIfElementHasFocused, checkIfElementExist } = require('../../helpers/e2e-utils.js');

describe('Area Puppeteer Tests', () => {
  describe('Area Disable Selection  State Tests', () => {
    const url = 'http://localhost:4000/components/area/example-disable-selection-state.html';

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
        isFailed.push(await checkDataAutomationID(`#area-${comp}-jan-dot`, `automation-id-area-${comp}-jan-dot`));
        isFailed.push(await checkDataAutomationID(`#area-${comp}-feb-dot`, `automation-id-area-${comp}-feb-dot`));
        isFailed.push(await checkDataAutomationID(`#area-${comp}-mar-dot`, `automation-id-area-${comp}-mar-dot`));
        isFailed.push(await checkDataAutomationID(`#area-${comp}-apr-dot`, `automation-id-area-${comp}-apr-dot`));
        isFailed.push(await checkDataAutomationID(`#area-${comp}-may-dot`, `automation-id-area-${comp}-may-dot`));
        isFailed.push(await checkDataAutomationID(`#area-${comp}-jun-dot`, `automation-id-area-${comp}-jun-dot`));
        isFailed.push(await checkDataAutomationID(`#area-comp-${comp}-legend-${index}`, `automation-id-area-comp-${comp}-legend-${index}`));
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
            isFailed.push(await checkTooltipValue('#area-a-jan-dot', tooltip, tooltipContent, 'Jan 32'));
            isFailed.push(await checkTooltipValue('#area-a-feb-dot', tooltip, tooltipContent, 'Feb 31'));
            isFailed.push(await checkTooltipValue('#area-a-mar-dot', tooltip, tooltipContent, 'Mar 34'));
            isFailed.push(await checkTooltipValue('#area-a-apr-dot', tooltip, tooltipContent, 'Apr 30'));
            isFailed.push(await checkTooltipValue('#area-a-may-dot', tooltip, tooltipContent, 'May 34'));
            isFailed.push(await checkTooltipValue('#area-a-jun-dot', tooltip, tooltipContent, 'Jun 38'));
            break;
          case 1: // Line B
            isFailed.push(await checkTooltipValue('#area-b-jan-dot', tooltip, tooltipContent, 'Jan 22'));
            isFailed.push(await checkTooltipValue('#area-b-feb-dot', tooltip, tooltipContent, 'Feb 21'));
            isFailed.push(await checkTooltipValue('#area-b-mar-dot', tooltip, tooltipContent, 'Mar 24'));
            isFailed.push(await checkTooltipValue('#area-b-apr-dot', tooltip, tooltipContent, 'Apr 20'));
            isFailed.push(await checkTooltipValue('#area-b-may-dot', tooltip, tooltipContent, 'May 24'));
            isFailed.push(await checkTooltipValue('#area-b-jun-dot', tooltip, tooltipContent, 'Jun 28'));
            break;
          case 2: // Line C
            isFailed.push(await checkTooltipValue('#area-c-jan-dot', tooltip, tooltipContent, 'Jan 12'));
            isFailed.push(await checkTooltipValue('#area-c-feb-dot', tooltip, tooltipContent, 'Feb 11'));
            isFailed.push(await checkTooltipValue('#area-c-mar-dot', tooltip, tooltipContent, 'Mar 14'));
            isFailed.push(await checkTooltipValue('#area-c-apr-dot', tooltip, tooltipContent, 'Apr 10'));
            isFailed.push(await checkTooltipValue('#area-c-may-dot', tooltip, tooltipContent, 'May 14'));
            isFailed.push(await checkTooltipValue('#area-c-jun-dot', tooltip, tooltipContent, 'Jun 8'));
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

        await page.hover(`#area-${comp}-jan-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#area-${comp}-jan-dot`)).toContain('inherit');
        await page.hover(`#area-${comp}-feb-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#area-${comp}-feb-dot`)).toContain('inherit');
        await page.hover(`#area-${comp}-mar-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#area-${comp}-mar-dot`)).toContain('inherit');
        await page.hover(`#area-${comp}-apr-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#area-${comp}-apr-dot`)).toContain('inherit');
        await page.hover(`#area-${comp}-may-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#area-${comp}-may-dot`)).toContain('inherit');
        await page.hover(`#area-${comp}-jun-dot`);
        await page.waitForTimeout(100);
        expect(await checkCursor(`#area-${comp}-jun-dot`)).toContain('inherit');
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
      const lineA = '#area-example > svg > g > g:nth-child(3)';
      const lineB = '#area-example > svg > g > g:nth-child(4)';
      const lineC = '#area-example > svg > g > g:nth-child(5)';
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
        await page.click(`#area-${comp}-jan-dot`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#area-${comp}-jan-dot`);
        await page.waitForTimeout(200);

        await page.click(`#area-${comp}-feb-dot`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#area-${comp}-feb-dot`);
        await page.waitForTimeout(200);

        await page.click(`#area-${comp}-mar-dot`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#area-${comp}-mar-dot`);
        await page.waitForTimeout(200);

        await page.click(`#area-${comp}-apr-dot`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#area-${comp}-apr-dot`);
        await page.waitForTimeout(200);

        await page.click(`#area-${comp}-may-dot`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#area-${comp}-may-dot`);
        await page.waitForTimeout(200);

        await page.click(`#area-${comp}-jun-dot`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#area-${comp}-jun-dot`);
        await page.waitForTimeout(200);
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    }, 10000);

    it('should not select line group on click in legends', async () => {
      const elHandleArray = await page.$$('.line-group');
      const isFailed = [];
      let index = 0;
      const lineA = '#area-example > svg > g > g:nth-child(3)';
      const lineB = '#area-example > svg > g > g:nth-child(4)';
      const lineC = '#area-example > svg > g > g:nth-child(5)';
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
        await page.click(`#area-comp-${comp}-legend-${index}`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#area-comp-${comp}-legend-${index}`);
        await page.waitForTimeout(200);
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });
});
