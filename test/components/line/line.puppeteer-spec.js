const { checkTooltipValue, checkDataAutomationID, checkClassNameValue } = require('../../helpers/e2e-utils.js');

describe('Line Puppeteer Tests', () => {
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
});

