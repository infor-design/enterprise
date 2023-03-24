const { getConfig } = require('../../helpers/e2e-utils.js');

describe('Column Grouped Puppeteer Tests', () => {
  describe('Column Grouped selection disable tests', () => {
    const url = 'http://localhost:4000/components/column-grouped/example-disable-selection-state';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the tooltip with data', async () => {
      await page.hover('#columngrouped-c2-jan-bar');
      await page.waitForTimeout(300);
      const tooltipElement = await page.evaluate(() => !!document.querySelector('.tooltip.top.is-hidden') !== true);

      expect(tooltipElement).toBeTruthy();
    });

    it('should not be selected when clicking on a column grouped', async () => {
      await page.click('#columngrouped-c2-jan-bar');
      const seriesGroup = await page.evaluate(() => !!document.querySelector('.series-group.is-selected') !== true);

      expect(seriesGroup).toBeTruthy();
    });

    it('should not show pointer as a cursor', async () => {
      await page.hover('#columngrouped-c2-jan-bar');
      await page.waitForTimeout(200);

      expect(await page.evaluate(() => document.querySelector('#columngrouped-c2-jan-bar').style.cursor)).toContain('inherit');
    });

    it('should not able to tab through the legends', async () => {
      // eslint-disable-next-line
      const legendTabIndex = await page.evaluate(() => Array.from(document.querySelectorAll('.chart-legend-item')).map(el => el.tabIndex));

      expect(legendTabIndex).toEqual([-1, -1, -1, -1, -1, -1]); // These are the values of tabindex of all the legends.
    });
  });

  describe('Ability to make a combined column chart and line chart tests', () => {
    const url = 'http://localhost:4000/components/column-grouped/example-column-grouped-with-line-combined';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it.skip('should run visual test', async () => {
      await page.waitForSelector('#column-line-id-dot-6');
      await page.waitForTimeout(350);
      const image = await page.screenshot();
      const config = getConfig('line-chart');
      expect(image).toMatchImageSnapshot(config);
    });

    it('should show tooltip when hovered', async () => {
      await page.waitForSelector('.dot');
      await page.hover('.dot');
      const value = await page.waitForSelector('#svg-tooltip');
      expect(value).toBeTruthy();
    });
  });
});
