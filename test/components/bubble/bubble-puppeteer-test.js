describe('Bubble Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/bubble';

  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  describe('Index', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to set id/automation id', async () => {
      const checkAttr = (select, val1, val2) => page.$eval(select, element => [element.id, element.getAttribute('data-automation-id')])
        .then((id) => {
          expect(id[0]).toEqual(val1);
          expect(id[1]).toEqual(val2);
        });

      const promises = [];

      months.forEach((month) => {
        promises.push(checkAttr(`#bubble-s1-${month}-dot`, `bubble-s1-${month}-dot`, `automation-id-bubble-s1-${month}-dot`));
        promises.push(checkAttr(`#bubble-s2-${month}-dot`, `bubble-s2-${month}-dot`, `automation-id-bubble-s2-${month}-dot`));
      });

      await checkAttr('#bubble-series1-line', 'bubble-series1-line', 'automation-id-bubble-series1-line');
      await checkAttr('#bubble-series2-line', 'bubble-series2-line', 'automation-id-bubble-series2-line');

      await checkAttr('#bubble-series1-legend-0', 'bubble-series1-legend-0', 'automation-id-bubble-series1-legend-0');
      await checkAttr('#bubble-series2-legend-1', 'bubble-series2-legend-1', 'automation-id-bubble-series2-legend-1');

      await Promise.all(promises);
    });
  });

  describe('Disable Selection  State Tests', () => {
    const url = `${baseUrl}/example-disable-selection-state.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not able to tab through the legends', async () => {
      const legendTabIndex = await page.$$eval('.chart-legend-item', e => e.map(el => el.tabIndex));
      expect(legendTabIndex).toEqual([-1, -1]); // These are the values of tabindex of all the legends.
    });

    it('should not select line group on click', async () => {
      const elHandleArray = await page.$$('.line-group');
      const lineA = '#bubble-example > svg > g > g:nth-child(3)';
      const lineB = '#bubble-example > svg > g > g:nth-child(4)';

      const promises = [];

      const clickEl = (month, el, index) => el.click().then(() => page.click(`#bubble-s${index + 1}-${month}-dot`)).then(async () => {
        const aClass = await page.$eval(lineA, element => element.getAttribute('class'));
        const bClass = await page.$eval(lineB, element => element.getAttribute('class'));
        expect(aClass).not.toContain('is-selected');
        expect(bClass).not.toContain('is-selected');
      }).then(() => page.click(`#bubble-s${index + 1}-${month}-dot`));

      elHandleArray.forEach((el, index) => {
        months.forEach((month) => {
          promises.push(clickEl(month, el, index));
        });
      });

      await Promise.all(promises);
    });

    it('should not select line group on click in legends', async () => {
      const elHandleArray = await page.$$('.line-group');
      const lineA = '#bubble-example > svg > g > g:nth-child(3)';
      const lineB = '#bubble-example > svg > g > g:nth-child(4)';

      const promises = [];

      const clickEl = (el, index) => el.click().then(() => page.click(`#bubble-series${index + 1}-legend-${index}`)).then(async () => {
        const aClass = await page.$eval(lineA, element => element.getAttribute('class'));
        const bClass = await page.$eval(lineB, element => element.getAttribute('class'));
        expect(aClass).not.toContain('is-selected');
        expect(bClass).not.toContain('is-selected');
      }).then(() => page.click(`#bubble-series${index + 1}-legend-${index}`));

      elHandleArray.forEach((el, index) => {
        promises.push(clickEl(el, index));
      });

      await Promise.all(promises);
    });
  });
});
