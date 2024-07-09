/* eslint-disable compat/compat */
describe('Column Chart Puppeteer Tests', () => {
  describe('Column Disable Selection  State tests', () => {
    const url = 'http://localhost:4000/components/column/example-disable-selection-state.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not able to tab through the legends', async () => {
      // eslint-disable-next-line
      await page.click('#btn-toggle-legend');
      const legendTabIndex = await page.$$eval('.chart-legend-item', e => e.map(el => el.tabIndex));
      expect(legendTabIndex).toEqual([-1]); // These are the values of tabindex of all the legends.
    });

    it.skip('should not highlight when selected', async () => {
      const elHandleArray = await page.$$('rect.bar');

      const promises = [];

      const hoverEl = (el, group, index) => el.hover().then(() => page.click(`rect.bar.series-${index}`)).then(async () => {
        const classNames = await page.$eval(`rect.bar.series-${group}`, element => element.getAttribute('class'));
        expect(classNames).toEqual(`bar series-${group}`);
      }).then(() => page.click(`rect.bar.series-${index}`));

      elHandleArray.forEach((el, index) => {
        for (let group = 0; group < 7; group++) {
          promises.push(hoverEl(el, group, index));
        }
      });

      await Promise.all(promises);
    });
  });
});
