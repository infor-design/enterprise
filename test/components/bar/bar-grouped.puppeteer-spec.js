const { checkClassNameValue, getConfig } = require('../../helpers/e2e-utils.js');
const utils = require('../../helpers/e2e-utils.js');

describe('Grouped Bar Chart Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000';

  describe('Grouped Bar Chart Disable Selection State Tests', () => {
    const url = `${baseUrl}/components/bar-grouped/example-disable-selection-state.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('Should not be able to tab through the legends', async () => {
      // eslint-disable-next-line
        const legendTabIndex = await page.$$eval('.chart-legend-item', e => e.map(el => el.tabIndex));
      expect(legendTabIndex).toEqual([-1, -1, -1, -1]); // These are the values of tabindex of all the legends.
    });

    it('Should not select bar on click', async () => {
      const isFailed = [];
      const seriesA = '#bar-grouped-example > svg > g > g:nth-child(3)';
      const seriesB = '#bar-grouped-example > svg > g > g:nth-child(4)';
      const seriesC = '#bar-grouped-example > svg > g > g:nth-child(5)';

      // Series A
      await page.click(seriesA);
      await page.waitForTimeout(100);
      isFailed.push(await checkClassNameValue(seriesA, 'series-group'));
      isFailed.push(await checkClassNameValue(seriesB, 'series-group'));
      isFailed.push(await checkClassNameValue(seriesC, 'series-group'));
      await page.click(seriesA);
      await page.waitForTimeout(100);

      // Series B
      await page.click(seriesB);
      await page.waitForTimeout(100);
      isFailed.push(await checkClassNameValue(seriesA, 'series-group'));
      isFailed.push(await checkClassNameValue(seriesB, 'series-group'));
      isFailed.push(await checkClassNameValue(seriesC, 'series-group'));
      await page.click(seriesB);
      await page.waitForTimeout(100);

      // Series C
      await page.click(seriesC);
      await page.waitForTimeout(100);
      isFailed.push(await checkClassNameValue(seriesA, 'series-group'));
      isFailed.push(await checkClassNameValue(seriesB, 'series-group'));
      isFailed.push(await checkClassNameValue(seriesC, 'series-group'));
      await page.click(seriesC);
      await page.waitForTimeout(100);

      expect(isFailed).not.toContain(true);
    });

    it('Should not select bar group on click in legends', async () => {
      const elHandleArray = await page.$$('.chart-legend-item');
      const isFailed = [];
      let index = 0;
      const seriesA = '#bar-grouped-example > svg > g > g:nth-child(3)';
      const seriesB = '#bar-grouped-example > svg > g > g:nth-child(4)';
      const seriesC = '#bar-grouped-example > svg > g > g:nth-child(5)';
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        await eL.hover();
        await page.click(`[index-id="chart-legend-${index}"]`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(seriesA, 'series-group'));
        isFailed.push(await checkClassNameValue(seriesB, 'series-group'));
        isFailed.push(await checkClassNameValue(seriesC, 'series-group'));
        await page.click(`[index-id="chart-legend-${index}"]`);
        await page.waitForTimeout(200);
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Grouped Bar Chart example-index tests', () => {
    const url = `${baseUrl}/components/bar-grouped/example-index.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('Should not have errors', async () => {
      await utils.checkForErrors();
    });

    it('Should have names for the graphs', async () => {
      const namesEl = await page.$$('.axis.y .tick text');

      expect(namesEl.length).toBe(3);
    });

    it('Should have bar groups', async () => {
      const groupEl = await page.$$('.group .series-group');

      expect(groupEl.length).toBe(3);
    });

    it('Should highlight when selected', async () => {
      page.waitForSelector('.series-group:nth-child(-n+3)', { visible: true });

      const seriesGroupEl = await page.$$('.series-group:nth-child(-n+3)');

      await page.click('.series-group:nth-child(-n+3)');

      const hasClassname = await checkClassNameValue(seriesGroupEl, 'is-selected');

      expect(hasClassname).toBe(true);
    });

    it('Should be able to set id/automation id', async () => {
      // A
      expect(await page.$eval('#bargroup-a-jan-bar', el => el.getAttribute('id'))).toBe('bargroup-a-jan-bar');
      expect(await page.$eval('#bargroup-a-jan-bar', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bargroup-a-jan-bar');

      expect(await page.$eval('#bargroup-a-feb-bar', el => el.getAttribute('id'))).toBe('bargroup-a-feb-bar');
      expect(await page.$eval('#bargroup-a-feb-bar', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bargroup-a-feb-bar');

      expect(await page.$eval('#bargroup-a-mar-bar', el => el.getAttribute('id'))).toBe('bargroup-a-mar-bar');
      expect(await page.$eval('#bargroup-a-mar-bar', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bargroup-a-mar-bar');

      expect(await page.$eval('#bargroup-a-apr-bar', el => el.getAttribute('id'))).toBe('bargroup-a-apr-bar');
      expect(await page.$eval('#bargroup-a-apr-bar', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bargroup-a-apr-bar');

      // B
      expect(await page.$eval('#bargroup-b-jan-bar', el => el.getAttribute('id'))).toBe('bargroup-b-jan-bar');
      expect(await page.$eval('#bargroup-b-jan-bar', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bargroup-b-jan-bar');

      expect(await page.$eval('#bargroup-b-feb-bar', el => el.getAttribute('id'))).toBe('bargroup-b-feb-bar');
      expect(await page.$eval('#bargroup-b-feb-bar', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bargroup-b-feb-bar');

      expect(await page.$eval('#bargroup-b-mar-bar', el => el.getAttribute('id'))).toBe('bargroup-b-mar-bar');
      expect(await page.$eval('#bargroup-b-mar-bar', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bargroup-b-mar-bar');

      expect(await page.$eval('#bargroup-b-apr-bar', el => el.getAttribute('id'))).toBe('bargroup-b-apr-bar');
      expect(await page.$eval('#bargroup-b-apr-bar', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bargroup-b-apr-bar');

      // C
      expect(await page.$eval('#bargroup-c-jan-bar', el => el.getAttribute('id'))).toBe('bargroup-c-jan-bar');
      expect(await page.$eval('#bargroup-c-jan-bar', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bargroup-c-jan-bar');

      expect(await page.$eval('#bargroup-c-feb-bar', el => el.getAttribute('id'))).toBe('bargroup-c-feb-bar');
      expect(await page.$eval('#bargroup-c-feb-bar', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bargroup-c-feb-bar');

      expect(await page.$eval('#bargroup-c-mar-bar', el => el.getAttribute('id'))).toBe('bargroup-c-mar-bar');
      expect(await page.$eval('#bargroup-c-mar-bar', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bargroup-c-mar-bar');

      expect(await page.$eval('#bargroup-c-apr-bar', el => el.getAttribute('id'))).toBe('bargroup-c-apr-bar');
      expect(await page.$eval('#bargroup-c-apr-bar', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bargroup-c-apr-bar');

      // Legend
      expect(await page.$eval('#bargroup-a-jan-legend-0', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bargroup-a-jan-legend-0');
      expect(await page.$eval('#bargroup-a-feb-legend-1', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bargroup-a-feb-legend-1');
      expect(await page.$eval('#bargroup-a-mar-legend-2', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bargroup-a-mar-legend-2');
      expect(await page.$eval('#bargroup-a-apr-legend-3', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bargroup-a-apr-legend-3');
    });

    it('Should not visual regress', async () => {
      // Resize the viewport
      await page.setViewport({ width: 1200, height: 800 });

      // Add a bit of a delay
      await page.waitForTimeout(200);

      // Screenshot of the page
      const image = await page.screenshot();

      // Set a custom name of the snapshot
      const config = getConfig('bar-grouped');

      // Compare the images
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Grouped Bar formatter tests', () => {
    const url = `${baseUrl}/components/bar-grouped/example-formatter?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('Should not have errors', async () => {
      await utils.checkForErrors();
    });

    it('Should not visual regress', async () => {
      // Resize the viewport
      await page.setViewport({ width: 1200, height: 800 });

      // Add a bit of a delay
      await page.waitForTimeout(200);

      // Screenshot of the page
      const image = await page.screenshot();

      // Set a custom name of the snapshot
      const config = getConfig('bar-grouped-formatter');

      // Compare the images
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
