const { checkClassNameValue } = require('../../helpers/e2e-utils.js');

describe('Bar (Stacked) Chart  Puppeteer Tests', () => {
  describe('Bar (Stacked) Chart Disable Selection  State Tests', () => {
    const url = 'http://localhost:4000/components/bar-stacked/example-disable-selection-state.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not able to tab through the legends', async () => {
      // eslint-disable-next-line
        const legendTabIndex = await page.$$eval('.chart-legend-item', e => e.map(el => el.tabIndex));
      expect(legendTabIndex).toEqual([-1, -1]); // These are the values of tabindex of all the legends.
    });

    it('should not highlight when selected', async () => {
      const elHandleArray = await page.$$('svg > g [data-group-id="0"] > .bar');
      const isFailed = [];
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let year = '';
        await eL.hover();
        switch (index) {
          case 0:
            year = '2008';
            await page.click(`#barstacked-s1-${year}-bar`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s1-2008-bar', 'bar series-0'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2009-bar', 'bar series-1'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2010-bar', 'bar series-2'));
            await page.click(`#barstacked-s1-${year}-bar`);
            await page.waitForTimeout(200);
            break;
          case 1:
            year = '2009';
            await page.click(`#barstacked-s1-${year}-bar`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s1-2008-bar', 'bar series-0'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2009-bar', 'bar series-1'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2010-bar', 'bar series-2'));
            await page.click(`#barstacked-s1-${year}-bar`);
            await page.waitForTimeout(200);
            break;
          case 2:
            year = '2010';
            await page.click(`#barstacked-s1-${year}-bar`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s1-2008-bar', 'bar series-0'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2009-bar', 'bar series-1'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2010-bar', 'bar series-2'));
            await page.click(`#barstacked-s1-${year}-bar`);
            await page.waitForTimeout(200);
            break;

          default:
            console.warn('series-group element not found');
        }
        index += 1;
      }
      expect(isFailed).not.toContain(true);

      // Series 2
      const elHandleArray2 = await page.$$('svg > g [data-group-id="1"] > .bar');
      const isFailed2 = [];
      let index2 = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray2) {
        let year2 = '';
        await eL.hover();
        switch (index2) {
          case 0:
            year2 = '2008';
            await page.click(`#barstacked-s2-${year2}-bar`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s2-2008-bar', 'bar series-0'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2009-bar', 'bar series-1'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2010-bar', 'bar series-2'));
            await page.click(`#barstacked-s2-${year2}-bar`);
            await page.waitForTimeout(200);
            break;
          case 1:
            year2 = '2009';
            await page.click(`#barstacked-s2-${year2}-bar`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s2-2008-bar', 'bar series-0'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2009-bar', 'bar series-1'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2010-bar', 'bar series-2'));
            await page.click(`#barstacked-s2-${year2}-bar`);
            await page.waitForTimeout(200);
            break;
          case 2:
            year2 = '2010';
            await page.click(`#barstacked-s2-${year2}-bar`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s2-2008-bar', 'bar series-0'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2009-bar', 'bar series-1'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2010-bar', 'bar series-2'));
            await page.click(`#barstacked-s2-${year2}-bar`);
            await page.waitForTimeout(200);
            break;

          default:
            console.warn('series-group element not found');
        }
        index2 += 1;
      }
      expect(isFailed2).not.toContain(true);
    });

    it('should not select bar stack on click in legends', async () => {
      const elHandleArray = await page.$$('.chart-legend-item');
      const isFailed = [];
      let index = 0;

      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        await eL.hover();
        switch (index) {
          case 0:
            await page.click(`[index-id="chart-legend-${index}"]`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s1-2008-bar', 'bar series-0'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2009-bar', 'bar series-1'));
            isFailed.push(await checkClassNameValue('#barstacked-s1-2010-bar', 'bar series-2'));
            await page.click(`[index-id="chart-legend-${index}"]`);
            await page.waitForTimeout(200);
            break;
          case 1:
            await page.click(`[index-id="chart-legend-${index}"]`);
            await page.waitForTimeout(200);
            isFailed.push(await checkClassNameValue('#barstacked-s2-2008-bar', 'bar series-0'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2009-bar', 'bar series-1'));
            isFailed.push(await checkClassNameValue('#barstacked-s2-2010-bar', 'bar series-2'));
            await page.click(`[index-id="chart-legend-${index}"]`);
            await page.waitForTimeout(200);
            break;
          default:
            console.warn('chart-legend-item element not found');
        }
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });
});
