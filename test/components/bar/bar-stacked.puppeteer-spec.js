const { checkClassNameValue } = require('../../helpers/e2e-utils.cjs');
const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Bar (Stacked) Chart  Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/bar-stacked';

  describe('Index', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
      await page.setViewport({ width: 1200, height: 800 });
    });

    it('should have names for graphs', async () => {
      expect(await page.evaluate(() => document.querySelectorAll('.axis.y .tick text').length)).toBe(3);
    });

    it('should have bar groups', async () => {
      expect(await page.evaluate(() => document.querySelectorAll('.group .series-group').length)).toBe(2);
    });

    it('should be a stacked bar', async () => {
      expect(await page.waitForSelector('.bar-chart-stacked', { visible: true })).toBeTruthy();
    });

    it('should highlight when selected', async () => {
      const bar = await page.waitForSelector('.series-group:nth-child(-n+3) .bar.series-0', { visible: true });
      await bar.click();

      // wait to show the element to have 'is-selected' class instead of using page.waitForTimeout
      const showSelectedBar = await page.waitForSelector('.series-group:nth-child(-n+3) .bar.series-0.is-selected', { visible: true });

      if (showSelectedBar) {
        await page.evaluate(() => document.querySelector('.series-group:nth-child(-n+3) .bar.series-0').getAttribute('class'))
          .then(classValue => expect(classValue).toContain('is-selected'));
      }
    });

    it('should be able to set id/automation id', async () => {
      await page.evaluate(() => document.getElementById('barstacked-s1-2008-bar').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('barstacked-s1-2008-bar'));
      await page.evaluate(() => document.getElementById('barstacked-s1-2008-bar').getAttribute('data-automation-id'))
        .then(idValue => expect(idValue).toEqual('automation-id-barstacked-s1-2008-bar'));
      await page.evaluate(() => document.getElementById('barstacked-s1-2009-bar').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('barstacked-s1-2009-bar'));
      await page.evaluate(() => document.getElementById('barstacked-s1-2009-bar').getAttribute('data-automation-id'))
        .then(idValue => expect(idValue).toEqual('automation-id-barstacked-s1-2009-bar'));
      await page.evaluate(() => document.getElementById('barstacked-s1-2010-bar').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('barstacked-s1-2010-bar'));
      await page.evaluate(() => document.getElementById('barstacked-s1-2010-bar').getAttribute('data-automation-id'))
        .then(idValue => expect(idValue).toEqual('automation-id-barstacked-s1-2010-bar'));

      await page.evaluate(() => document.getElementById('barstacked-s2-2008-bar').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('barstacked-s2-2008-bar'));
      await page.evaluate(() => document.getElementById('barstacked-s2-2008-bar').getAttribute('data-automation-id'))
        .then(idValue => expect(idValue).toEqual('automation-id-barstacked-s2-2008-bar'));
      await page.evaluate(() => document.getElementById('barstacked-s2-2009-bar').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('barstacked-s2-2009-bar'));
      await page.evaluate(() => document.getElementById('barstacked-s2-2009-bar').getAttribute('data-automation-id'))
        .then(idValue => expect(idValue).toEqual('automation-id-barstacked-s2-2009-bar'));
      await page.evaluate(() => document.getElementById('barstacked-s2-2010-bar').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('barstacked-s2-2010-bar'));
      await page.evaluate(() => document.getElementById('barstacked-s2-2010-bar').getAttribute('data-automation-id'))
        .then(idValue => expect(idValue).toEqual('automation-id-barstacked-s2-2010-bar'));

      await page.evaluate(() => document.getElementById('barstacked-series1-legend-0').getAttribute('data-automation-id'))
        .then(idValue => expect(idValue).toEqual('automation-id-barstacked-series1-legend-0'));
      await page.evaluate(() => document.getElementById('barstacked-series2-legend-1').getAttribute('data-automation-id'))
        .then(idValue => expect(idValue).toEqual('automation-id-barstacked-series2-legend-1'));
    });

    it('should not visually regress the bar stacked', async () => {
      const container = await page.$('.container');
      const image = await container.screenshot();
      const config = getConfig('bar-stacked-index');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Example Colors', () => {
    const url = `${baseUrl}/example-stacked-colors`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should detect the first bar is green', async () => {
      await page.evaluate(() => document.querySelectorAll('.series-group .bar.series-0')[0].getAttribute('style'))
        .then(cssVal => expect(cssVal).toBe('fill: rgb(168, 225, 225);'));
    });

    it('should detect the second bar is violet', async () => {
      await page.evaluate(() => document.querySelectorAll('.series-group .bar.series-0')[1].getAttribute('style'))
        .then(cssVal => expect(cssVal).toBe('fill: rgb(121, 40, 225);'));
    });
  });

  describe('Chart 100%', () => {
    const url = `${baseUrl}/example-stacked-100?theme=classic&layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.setViewport({ width: 1200, height: 800 });
    });

    it('should be able to set id/automation id', async () => {
      await page.evaluate(() => document.getElementById('barstacked-c1-2014-bar').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('barstacked-c1-2014-bar'));
      await page.evaluate(() => document.getElementById('barstacked-c1-2014-bar').getAttribute('data-automation-id'))
        .then(idValue => expect(idValue).toEqual('automation-id-barstacked-c1-2014-bar'));
      await page.evaluate(() => document.getElementById('barstacked-c1-2015-bar').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('barstacked-c1-2015-bar'));
      await page.evaluate(() => document.getElementById('barstacked-c1-2015-bar').getAttribute('data-automation-id'))
        .then(idValue => expect(idValue).toEqual('automation-id-barstacked-c1-2015-bar'));

      await page.evaluate(() => document.getElementById('barstacked-c2-2014-bar').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('barstacked-c2-2014-bar'));
      await page.evaluate(() => document.getElementById('barstacked-c2-2014-bar').getAttribute('data-automation-id'))
        .then(idValue => expect(idValue).toEqual('automation-id-barstacked-c2-2014-bar'));

      await page.evaluate(() => document.getElementById('barstacked-c2-2015-bar').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('barstacked-c2-2015-bar'));
      await page.evaluate(() => document.getElementById('barstacked-c2-2015-bar').getAttribute('data-automation-id'))
        .then(idValue => expect(idValue).toEqual('automation-id-barstacked-c2-2015-bar'));

      await page.evaluate(() => document.getElementById('barstacked-comp1-legend-0').getAttribute('data-automation-id'))
        .then(idValue => expect(idValue).toEqual('automation-id-barstacked-comp1-legend-0'));
      await page.evaluate(() => document.getElementById('barstacked-comp2-legend-1').getAttribute('data-automation-id'))
        .then(idValue => expect(idValue).toEqual('automation-id-barstacked-comp2-legend-1'));
    });

    it('should not visual regress', async () => {
      const container = await page.waitForSelector('.container');
      const image = await container.screenshot();
      const config = getConfig('bar-stacked-100');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Selection State', () => {
    const url = `${baseUrl}/example-disable-selection-state.html`;

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
