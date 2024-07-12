/* eslint-disable compat/compat */

describe.skip('Column Stacked Chart Puppeteer Tests', () => {
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
      const stackGroup = await page.$$('g [data-group-id="0"] > rect.bar');

      const promises = [];

      const hoverEl = (el, index) => el.hover().then(() => page.click(`g [data-group-id="0"] > rect.series-${index}`))
        .then(async () => {
          const group0 = await page.$eval(`g [data-group-id="0"] > rect.bar.series-${index}`, element => element.getAttribute('class'));
          const group1 = await page.$eval(`g [data-group-id="1"] > rect.bar.series-${index}`, element => element.getAttribute('class'));
          const group2 = await page.$eval(`g [data-group-id="2"] > rect.bar.series-${index}`, element => element.getAttribute('class'));
          expect(group0).toEqual(`series-${index} bar`);
          expect(group1).toEqual(`series-${index} bar`);
          expect(group2).toEqual(`series-${index} bar`);
        }).then(() => page.click(`g [data-group-id="0"] > rect.series-${index}`));

      stackGroup.forEach((el, index) => {
        promises.push(hoverEl(el, index));
      });

      await Promise.all(promises);
    });

    it('should not select bar group on click in legends', async () => {
      const elHandleArray = await page.$$('.chart-legend-item');

      const promises = [];

      const hoverEl = (el, group, index) => el.hover().then(() => page.click(`[index-id="chart-legend-${index}"]`)).then(async () => {
        const classNames = await page.$eval(`g [data-group-id="${index}"] > rect.bar.series-${group}`, element => element.getAttribute('class'));
        expect(classNames).toEqual(`series-${group} bar`);
      }).then(() => page.click(`[index-id="chart-legend-${index}"]`));

      elHandleArray.forEach((el, index) => {
        for (let group = 0; group < 12; group++) {
          promises.push(hoverEl(el, group, index));
        }
      });

      await Promise.all(promises);
    });
  });
});
