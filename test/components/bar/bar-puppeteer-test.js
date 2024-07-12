const { checkDataAutomationId, checkClassNameValue, getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Bar Chart', () => {
  const baseUrl = 'http://localhost:4000/components/bar';

  describe('Bar Chart Disable Selection State Tests', () => {
    const url = `${baseUrl}/example-disable-selection-state.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to set id/automation id', async () => {
      await checkDataAutomationId('#bar-a-bar', 'automation-id-bar-a-bar');
      await checkDataAutomationId('#bar-b-bar', 'automation-id-bar-b-bar');
      await checkDataAutomationId('#bar-c-bar', 'automation-id-bar-c-bar');
    });

    it.skip('should not show pointer as a cursor', async () => {
      const checkCursor = async el => page.$eval(el, e => e.style.cursor);
      await page.waitForSelector('#bar-a-bar', { visible: true });
      await page.hover('#bar-a-bar');
      expect(await checkCursor('#bar-a-bar')).toContain('inherit');

      // bar b
      await page.hover('#bar-b-bar');

      expect(await checkCursor('#bar-b-bar')).toContain('inherit');

      // bar c
      await page.hover('#bar-c-bar');

      expect(await checkCursor('#bar-c-bar')).toContain('inherit');
    });

    // Improve test. Flaky test in CI
    it.skip('should not select bar on click', async () => {
      const isFailed = [];
      const barA = '#bar-a-bar';
      const barB = '#bar-b-bar';
      const barC = '#bar-c-bar';

      await page.click('#bar-a-bar');

      isFailed.push(await checkClassNameValue(barA, 'bar series-0'));
      isFailed.push(await checkClassNameValue(barB, 'bar series-1'));
      isFailed.push(await checkClassNameValue(barC, 'bar series-2'));
      await page.click('#bar-a-bar');
      await page.click('#bar-b-bar');

      isFailed.push(await checkClassNameValue(barA, 'bar series-0'));
      isFailed.push(await checkClassNameValue(barB, 'bar series-1'));
      isFailed.push(await checkClassNameValue(barC, 'bar series-2'));
      await page.click('#bar-b-bar');

      await page.click('#bar-c-bar');

      isFailed.push(await checkClassNameValue(barA, 'bar series-0'));
      isFailed.push(await checkClassNameValue(barB, 'bar series-1'));
      isFailed.push(await checkClassNameValue(barC, 'bar series-2'));
      await page.click('#bar-c-bar');

      expect(isFailed).not.toContain(true);
    });
  });

  describe('Bar Chart example-index tests', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should have names for the graphs', async () => {
      const namesEl = await page.$$('.axis.y .tick text');

      expect(namesEl.length).toBe(3);
    });

    it('should have greyed out bars when not selected', async () => {
      await page.click('.bar.series-0');
      await page.waitForSelector('.bar.series-0');

      expect(await page.$eval('.bar.series-0', e => getComputedStyle(e).opacity)).toBe('1');
    });

    it('should be able to set id/automation id', async () => {
      expect(await page.$eval('#bar-a-bar', el => el.getAttribute('id'))).toBe('bar-a-bar');
      expect(await page.$eval('#bar-a-bar', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bar-a-bar');

      expect(await page.$eval('#bar-b-bar', el => el.getAttribute('id'))).toBe('bar-b-bar');
      expect(await page.$eval('#bar-b-bar', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bar-b-bar');

      expect(await page.$eval('#bar-c-bar', el => el.getAttribute('id'))).toBe('bar-c-bar');
      expect(await page.$eval('#bar-c-bar', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bar-c-bar');
    });

    it.skip('should not visually regress', async () => {
      // Add a bit of a delay

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

    it('should have axis labels', async () => {
      const axisLabels = () => page.$eval('.axis-labels', element => element.innerHTML);
      expect(await axisLabels()).toContain('axis-label-left');
      expect(await axisLabels()).toContain('axis-label-top');
      expect(await axisLabels()).toContain('axis-label-right');
      expect(await axisLabels()).toContain('axis-label-bottom');
    });

    it.skip('should not have visual regressions in axis labels', async () => {
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

    it('should have axis labels', async () => {
      const axisLabels = () => page.$eval('.axis-labels', element => element.innerHTML);
      expect(await axisLabels()).toContain('axis-label-left');
      expect(await axisLabels()).toContain('axis-label-top');
      expect(await axisLabels()).toContain('axis-label-right');
      expect(await axisLabels()).toContain('axis-label-bottom');
    });

    it.skip('should not have visual regressions in axis labels RTL', async () => {
      expect(await page.waitForSelector('.bar-chart', { visible: true })).toBeTruthy();

      const image = await page.screenshot();
      const config = getConfig('bar-chart-with-axis-labels-rtl');

      expect(image).toMatchImageSnapshot(config);
    });
  });
});
