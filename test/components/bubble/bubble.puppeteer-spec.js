const { checkClassNameValue } = require('../../helpers/e2e-utils.js');

describe('Bubble Puppeteer Tests', () => {
  describe('Bubble Disable Selection  State Tests', () => {
    const url = 'http://localhost:4000/components/bubble/example-disable-selection-state.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
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
});
