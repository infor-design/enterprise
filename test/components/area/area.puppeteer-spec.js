const { checkClassNameValue } = require('../../helpers/e2e-utils.js');

describe('Area Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/area';

  describe('Index Tests', () => {
    const url = `${baseUrl}/example-index`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to set id/automation id', async () => {
      // Dot A's (January - June)
      const janDotA = await page.waitForSelector('#area-a-jan-dot', { visible: true });
      const febDotA = await page.waitForSelector('#area-a-feb-dot', { visible: true });
      const marDotA = await page.waitForSelector('#area-a-mar-dot', { visible: true });
      const aprDotA = await page.waitForSelector('#area-a-apr-dot', { visible: true });
      const mayDotA = await page.waitForSelector('#area-a-may-dot', { visible: true });
      const junDotA = await page.waitForSelector('#area-a-jun-dot', { visible: true });

      // Dot B's
      const janDotB = await page.waitForSelector('#area-b-jan-dot', { visible: true });
      const febDotB = await page.waitForSelector('#area-b-feb-dot', { visible: true });
      const marDotB = await page.waitForSelector('#area-b-mar-dot', { visible: true });
      const aprDotB = await page.waitForSelector('#area-b-apr-dot', { visible: true });
      const mayDotB = await page.waitForSelector('#area-b-may-dot', { visible: true });
      const junDotB = await page.waitForSelector('#area-b-jun-dot', { visible: true });

      // Dot C's
      const janDotC = await page.waitForSelector('#area-c-jan-dot', { visible: true });
      const febDotC = await page.waitForSelector('#area-c-feb-dot', { visible: true });
      const marDotC = await page.waitForSelector('#area-c-mar-dot', { visible: true });
      const aprDotC = await page.waitForSelector('#area-c-apr-dot', { visible: true });
      const mayDotC = await page.waitForSelector('#area-c-may-dot', { visible: true });
      const junDotC = await page.waitForSelector('#area-c-jun-dot', { visible: true });

      // A
      expect(await janDotA.evaluate(el => el.getAttribute('id'))).toContain('area-a-jan-dot');
      expect(await janDotA.evaluate(el => el.getAttribute('data-automation-id'))).toContain('automation-id-area-a-jan-dot');
      expect(await febDotA.evaluate(el => el.getAttribute('id'))).toContain('area-a-feb-dot');
      expect(await febDotA.evaluate(el => el.getAttribute('data-automation-id'))).toContain('automation-id-area-a-feb-dot');
      expect(await marDotA.evaluate(el => el.getAttribute('id'))).toContain('area-a-mar-dot');
      expect(await marDotA.evaluate(el => el.getAttribute('data-automation-id'))).toContain('automation-id-area-a-mar-dot');
      expect(await aprDotA.evaluate(el => el.getAttribute('id'))).toContain('area-a-apr-dot');
      expect(await aprDotA.evaluate(el => el.getAttribute('data-automation-id'))).toContain('automation-id-area-a-apr-dot');
      expect(await mayDotA.evaluate(el => el.getAttribute('id'))).toContain('area-a-may-dot');
      expect(await mayDotA.evaluate(el => el.getAttribute('data-automation-id'))).toContain('automation-id-area-a-may-dot');
      expect(await junDotA.evaluate(el => el.getAttribute('id'))).toContain('area-a-jun-dot');
      expect(await junDotA.evaluate(el => el.getAttribute('data-automation-id'))).toContain('automation-id-area-a-jun-dot');

      // B
      expect(await janDotB.evaluate(el => el.getAttribute('id'))).toContain('area-b-jan-dot');
      expect(await janDotB.evaluate(el => el.getAttribute('data-automation-id'))).toContain('automation-id-area-b-jan-dot');
      expect(await febDotB.evaluate(el => el.getAttribute('id'))).toContain('area-b-feb-dot');
      expect(await febDotB.evaluate(el => el.getAttribute('data-automation-id'))).toContain('automation-id-area-b-feb-dot');
      expect(await marDotB.evaluate(el => el.getAttribute('id'))).toContain('area-b-mar-dot');
      expect(await marDotB.evaluate(el => el.getAttribute('data-automation-id'))).toContain('automation-id-area-b-mar-dot');
      expect(await aprDotB.evaluate(el => el.getAttribute('id'))).toContain('area-b-apr-dot');
      expect(await aprDotB.evaluate(el => el.getAttribute('data-automation-id'))).toContain('automation-id-area-b-apr-dot');
      expect(await mayDotB.evaluate(el => el.getAttribute('id'))).toContain('area-b-may-dot');
      expect(await mayDotB.evaluate(el => el.getAttribute('data-automation-id'))).toContain('automation-id-area-b-may-dot');
      expect(await junDotB.evaluate(el => el.getAttribute('id'))).toContain('area-b-jun-dot');
      expect(await junDotB.evaluate(el => el.getAttribute('data-automation-id'))).toContain('automation-id-area-b-jun-dot');

      // C
      expect(await janDotC.evaluate(el => el.getAttribute('id'))).toContain('area-c-jan-dot');
      expect(await janDotC.evaluate(el => el.getAttribute('data-automation-id'))).toContain('automation-id-area-c-jan-dot');
      expect(await febDotC.evaluate(el => el.getAttribute('id'))).toContain('area-c-feb-dot');
      expect(await febDotC.evaluate(el => el.getAttribute('data-automation-id'))).toContain('automation-id-area-c-feb-dot');
      expect(await marDotC.evaluate(el => el.getAttribute('id'))).toContain('area-c-mar-dot');
      expect(await marDotC.evaluate(el => el.getAttribute('data-automation-id'))).toContain('automation-id-area-c-mar-dot');
      expect(await aprDotC.evaluate(el => el.getAttribute('id'))).toContain('area-c-apr-dot');
      expect(await aprDotC.evaluate(el => el.getAttribute('data-automation-id'))).toContain('automation-id-area-c-apr-dot');
      expect(await mayDotC.evaluate(el => el.getAttribute('id'))).toContain('area-c-may-dot');
      expect(await mayDotC.evaluate(el => el.getAttribute('data-automation-id'))).toContain('automation-id-area-c-may-dot');
      expect(await junDotC.evaluate(el => el.getAttribute('id'))).toContain('area-c-jun-dot');
      expect(await junDotC.evaluate(el => el.getAttribute('data-automation-id'))).toContain('automation-id-area-c-jun-dot');
    });
  });

  describe('Area Empty Tests', () => {
    const url = `${baseUrl}/test-empty`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the empty area', async () => {
      const emptyMsg = await page.waitForSelector('.empty-message', { visible: true });
      const emptyTitle = await page.waitForSelector('.empty-title', { visible: true });

      expect(emptyMsg).toBeTruthy();
      expect(await emptyTitle.evaluate(el => el.textContent)).toContain('No Data Available');
    });
  });

  describe('Area Disable Selection  State Tests', () => {
    const url = `${baseUrl}/example-disable-selection-state`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not able to tab through the legends', async () => {
      // eslint-disable-next-line
      const legendTabIndex = await page.$$eval('.chart-legend-item', e => e.map(el => el.tabIndex));
      expect(legendTabIndex).toEqual([-1, -1, -1]); // These are the values of tabindex of all the legends.
    });

    it('should not select line group on click', async () => {
      const elHandleArray = await page.$$('.line-group');
      const isFailed = [];
      let index = 0;
      const lineA = '#area-example > svg > g > g:nth-child(3)';
      const lineB = '#area-example > svg > g > g:nth-child(4)';
      const lineC = '#area-example > svg > g > g:nth-child(5)';
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let comp = '';
        await eL.click();
        switch (index) {
          case 0: // Line A
            comp = 'a';
            break;
          case 1: // Line B
            comp = 'b';
            break;
          case 2: // Line C
            comp = 'c';
            break;
          default:
            console.warn('line-group element not found');
        }
        await page.click(`#area-${comp}-jan-dot`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#area-${comp}-jan-dot`);
        await page.waitForTimeout(200);

        await page.click(`#area-${comp}-feb-dot`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#area-${comp}-feb-dot`);
        await page.waitForTimeout(200);

        await page.click(`#area-${comp}-mar-dot`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#area-${comp}-mar-dot`);
        await page.waitForTimeout(200);

        await page.click(`#area-${comp}-apr-dot`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#area-${comp}-apr-dot`);
        await page.waitForTimeout(200);

        await page.click(`#area-${comp}-may-dot`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#area-${comp}-may-dot`);
        await page.waitForTimeout(200);

        await page.click(`#area-${comp}-jun-dot`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#area-${comp}-jun-dot`);
        await page.waitForTimeout(200);
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    }, 10000);

    it('should not select line group on click in legends', async () => {
      const elHandleArray = await page.$$('.line-group');
      const isFailed = [];
      let index = 0;
      const lineA = '#area-example > svg > g > g:nth-child(3)';
      const lineB = '#area-example > svg > g > g:nth-child(4)';
      const lineC = '#area-example > svg > g > g:nth-child(5)';
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        let comp = '';
        await eL.click();
        switch (index) {
          case 0: // Line A
            comp = 'a';
            break;
          case 1: // Line B
            comp = 'b';
            break;
          case 2: // Line C
            comp = 'c';
            break;
          default:
            console.warn('line-group element not found');
        }
        await page.click(`#area-comp-${comp}-legend-${index}`);
        await page.waitForTimeout(200);
        isFailed.push(await checkClassNameValue(lineA, 'line-group'));
        isFailed.push(await checkClassNameValue(lineB, 'line-group'));
        isFailed.push(await checkClassNameValue(lineC, 'line-group'));
        await page.click(`#area-comp-${comp}-legend-${index}`);
        await page.waitForTimeout(200);
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });
});
