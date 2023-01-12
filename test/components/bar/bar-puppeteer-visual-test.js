const { checkDataAutomationID, checkTooltipValue, checkClassNameValue, getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Bar Chart', () => {
  const baseUrl = 'http://localhost:4000/components/bar';

  describe('Bar Chart Disable Selection State Tests', () => {
    const url = `${baseUrl}/example-disable-selection-state.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to set id/automation id', async () => {
      const isFailed = [];
      isFailed.push(await checkDataAutomationID('#bar-a-bar', 'automation-id-bar-a-bar'));
      isFailed.push(await checkDataAutomationID('#bar-b-bar', 'automation-id-bar-b-bar'));
      isFailed.push(await checkDataAutomationID('#bar-c-bar', 'automation-id-bar-c-bar'));
      expect(isFailed).not.toContain(true);
    });

    it('should show the tooltip with data', async () => {
      await page.setViewport({
        width: 1200,
        height: 800,
        deviceScaleFactor: 1,
      });
      const tooltip = '#svg-tooltip';
      const tooltipContent = '#svg-tooltip .tooltip-content';
      const isFailed = [];
      // Series 1
      isFailed.push(await checkTooltipValue('#bar-a-bar', tooltip, tooltipContent, 'Tooltip by Data\nComponent A\nInformation'));
      isFailed.push(await checkTooltipValue('#bar-b-bar', tooltip, tooltipContent, 'Category B 372'));
      isFailed.push(await checkTooltipValue('#bar-c-bar', tooltip, tooltipContent, 'Category C 236.35'));
      expect(isFailed).not.toContain(true);
    });

    it.skip('should not show pointer as a cursor', async () => {
      const checkCursor = async el => page.$eval(el, e => e.style.cursor);
      await page.waitForSelector('#bar-a-bar', { visible: true });
      await page.hover('#bar-a-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bar-a-bar')).toContain('inherit');

      // bar b
      await page.hover('#bar-b-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bar-b-bar')).toContain('inherit');

      // bar c
      await page.hover('#bar-c-bar');
      await page.waitForTimeout(100);
      expect(await checkCursor('#bar-c-bar')).toContain('inherit');
    });

    it('should not select bar on click', async () => {
      const isFailed = [];
      const barA = '#bar-a-bar';
      const barB = '#bar-b-bar';
      const barC = '#bar-c-bar';

      await page.click('#bar-a-bar');
      await page.waitForTimeout(100);
      isFailed.push(await checkClassNameValue(barA, 'bar series-0'));
      isFailed.push(await checkClassNameValue(barB, 'bar series-1'));
      isFailed.push(await checkClassNameValue(barC, 'bar series-2'));
      await page.click('#bar-a-bar');
      await page.waitForTimeout(100);

      await page.click('#bar-b-bar');
      await page.waitForTimeout(100);
      isFailed.push(await checkClassNameValue(barA, 'bar series-0'));
      isFailed.push(await checkClassNameValue(barB, 'bar series-1'));
      isFailed.push(await checkClassNameValue(barC, 'bar series-2'));
      await page.click('#bar-b-bar');
      await page.waitForTimeout(100);

      await page.click('#bar-c-bar');
      await page.waitForTimeout(100);
      isFailed.push(await checkClassNameValue(barA, 'bar series-0'));
      isFailed.push(await checkClassNameValue(barB, 'bar series-1'));
      isFailed.push(await checkClassNameValue(barC, 'bar series-2'));
      await page.click('#bar-c-bar');
      await page.waitForTimeout(100);

      expect(isFailed).not.toContain(true);
    });
  });

  describe('Bar Chart example-index tests', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      // Add a bit of a delay
      await page.waitForTimeout(200);

      // Screenshot of the page
      const image = await page.screenshot();

      // Set a custom name of the snapshot
      const config = getConfig('bar-index');

      // Compare the images
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Bar Chart with axis labels tests', () => {
    const url = `${baseUrl}/example-axis-labels`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not have visual regressions in axis labels', async () => {
      expect(await page.waitForSelector('.bar-chart', { visible: true })).toBeTruthy();

      const image = await page.screenshot();
      const config = getConfig('bar-chart-with-axis-labels');

      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Bar Chart RTL tests', () => {
    const url = `${baseUrl}/example-axis-labels?locale=ar-EG`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not have visual regressions in axis labels RTL', async () => {
      expect(await page.waitForSelector('.bar-chart', { visible: true })).toBeTruthy();

      const image = await page.screenshot();
      const config = getConfig('bar-chart-with-axis-labels-rtl');

      expect(image).toMatchImageSnapshot(config);
    });
  });
});

describe('Grouped Bar Chart Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000';

  describe('Grouped Bar Chart example-index tests', () => {
    const url = `${baseUrl}/components/bar-grouped/example-index.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
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

    it('should not visually regress', async () => {
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

  describe('Grouped Bar many groups tests', () => {
    const url = `${baseUrl}/components/bar-grouped/test-many-groups?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      // Resize the viewport
      await page.setViewport({ width: 1200, height: 800 });

      // Add a bit of a delay
      await page.waitForTimeout(200);

      // Screenshot of the page
      const image = await page.screenshot();

      // Set a custom name of the snapshot
      const config = getConfig('bar-grouped-many-groups');

      // Compare the images
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Grouped Bar Chart example-negative-value tests', () => {
    const url = `${baseUrl}/components/bar-grouped/example-negative`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should have negative values', async () => {
      const valueEl = await page.$$('.axis.x .tick .negative-value');

      expect(valueEl.length).toBe(2);
    });
  });

  describe.skip('Grouped Bar Chart example-selected tests', () => {
    const url = `${baseUrl}/components/bar-grouped/test-selected`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be highlighted when selected', async () => {
      page.waitForSelector('.group .series-group', { visible: true });

      const fGroupEl = await page.$$('.group .series-group');

      const hasClassname = await checkClassNameValue(fGroupEl, 'is-selected');

      expect(hasClassname).toBe(true);
    });
  });
});

describe('Bar (Stacked) Chart  Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/bar-stacked';

  describe('Index', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
      await page.setViewport({ width: 1200, height: 800 });
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

    it('should not visually regress', async () => {
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

