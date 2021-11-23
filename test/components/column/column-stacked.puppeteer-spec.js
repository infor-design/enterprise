const { checkClassNameValue } = require('../../helpers/e2e-utils.js');

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
