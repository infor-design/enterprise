const { checkDataAutomationID, checkTooltipValue, checkClassNameValue, getConfig } = require('../../helpers/e2e-utils.js');

describe('Bar Chart Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components';

  describe('Bar Chart Disable Selection State Tests', () => {
    const url = `${baseUrl}/bar/example-disable-selection-state.html`;

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

    it('should not show pointer as a cursor', async () => {
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
    const url = `${baseUrl}/bar/example-index?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should have names for the graphs', async () => {
      const namesEl = await page.$$('.axis.y .tick text');

      expect(namesEl.length).toBe(3);
    });

    it('should have greyed out bars when not selected', async () => {
      const barEl = await page.$$('.bar.series-0');
      const barTestEl = await page.$$('.bar.series-1');

      await page.click('.bar.series-0');

      await page.waitForSelector('.bar.series-0', { visible: true });

      const hasClassname = await checkClassNameValue(barEl, 'is-selected');
      expect(hasClassname).toBe(true);

      await page.waitForTimeout(200);

      expect(await page.$eval('.bar.series-1', e => getComputedStyle(e).opacity)).toBe('0.6');
    });

    it('should be able to set id/automation id', async () => {
      await page.waitForTimeout(200);


      expect(await page.$eval('#bar-a-bar', el => el.getAttribute('id'))).toBe('bar-a-bar');
      expect(await page.$eval('#bar-a-bar', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bar-a-bar');

      expect(await page.$eval('#bar-b-bar', el => el.getAttribute('id'))).toBe('bar-b-bar');
      expect(await page.$eval('#bar-b-bar', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bar-b-bar');

      expect(await page.$eval('#bar-c-bar', el => el.getAttribute('id'))).toBe('bar-c-bar');
      expect(await page.$eval('#bar-c-bar', el => el.getAttribute('data-automation-id'))).toBe('automation-id-bar-c-bar');
    });

    it('should not visual regress', async () => {
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
});
