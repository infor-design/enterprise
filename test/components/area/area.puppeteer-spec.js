/* eslint-disable compat/compat */
describe('Area Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/area';
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun'];
  const comps = ['a', 'b', 'c'];

  describe('Index Tests', () => {
    const url = `${baseUrl}/example-index`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to set id/automation id', async () => {
      const promises = [];

      const checkAttr = (comp, month) => page.waitForSelector(`#area-${comp}-${month}-dot`, { visible: true })
        .then(elHandle => elHandle.evaluate(el => [el.getAttribute('id'), el.getAttribute('data-automation-id')]))
        .then((idArr) => {
          expect(idArr[0]).toEqual(`area-${comp}-${month}-dot`);
          expect(idArr[1]).toEqual(`automation-id-area-${comp}-${month}-dot`);
        });

      months.forEach((month) => {
        comps.forEach(comp => promises.push(checkAttr(comp, month)));
      });

      await Promise.all(promises);
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
      const lineA = '#area-example > svg > g > g:nth-child(3)';
      const lineB = '#area-example > svg > g > g:nth-child(4)';
      const lineC = '#area-example > svg > g > g:nth-child(5)';

      const promises = [];

      const clickEl = (el, month, comp) => el.click().then(() => page.click(`#area-${comp}-${month}-dot`)).then(async () => {
        const aClass = await page.$eval(lineA, element => element.getAttribute('class'));
        const bClass = await page.$eval(lineB, element => element.getAttribute('class'));
        const cClass = await page.$eval(lineC, element => element.getAttribute('class'));
        expect(aClass).not.toContain('is-selected');
        expect(bClass).not.toContain('is-selected');
        expect(cClass).not.toContain('is-selected');
      }).then(() => page.click(`#area-${comp}-${month}-dot`));

      elHandleArray.forEach((el) => {
        months.forEach((month) => {
          comps.forEach(comp => promises.push(clickEl(el, month, comp)));
        });
      });

      await Promise.all(promises);
    });

    it('should not select line group on click in legends', async () => {
      const elHandleArray = await page.$$('.line-group');
      const lineA = '#area-example > svg > g > g:nth-child(3)';
      const lineB = '#area-example > svg > g > g:nth-child(4)';
      const lineC = '#area-example > svg > g > g:nth-child(5)';

      const promises = [];

      const clickEl = (el, comp, index) => el.click().then(() => page.click(`#area-comp-${comp}-legend-${index}`)).then(async () => {
        const aClass = await page.$eval(lineA, element => element.getAttribute('class'));
        const bClass = await page.$eval(lineB, element => element.getAttribute('class'));
        const cClass = await page.$eval(lineC, element => element.getAttribute('class'));
        expect(aClass).not.toContain('is-selected');
        expect(bClass).not.toContain('is-selected');
        expect(cClass).not.toContain('is-selected');
      }).then(() => page.click(`#area-comp-${comp}-legend-${index}`));

      elHandleArray.forEach((el) => {
        comps.forEach((comp, index) => promises.push(clickEl(el, comp, index)));
      });

      await Promise.all(promises);
    });
  });
});
