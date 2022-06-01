/* eslint-disable compat/compat */
const { getConfig } = require('../../helpers/e2e-utils.js');

describe('Bubble Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/bubble';

  describe('Index', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visual regress', async () => {
      await page.waitForFunction('document.querySelectorAll("div[role=main]").length > 0');
      const img = await page.screenshot();
      const sConfig = getConfig('bubble');
      expect(img).toMatchImageSnapshot(sConfig);
    });

    it('should be able to set id/automation id', async () => {
      const checkAttr = (select, val1, val2) => page.$eval(select, element => [element.id, element.getAttribute('data-automation-id')])
        .then((id) => {
          expect(id[0]).toEqual(val1);
          expect(id[1]).toEqual(val2);
        });

      const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const promises = [];

      months.forEach((month) => {
        promises.push(checkAttr(`#bubble-s1-${month}-dot`, `bubble-s1-${month}-dot`, `automation-id-bubble-s1-${month}-dot`));
        promises.push(checkAttr(`#bubble-s2-${month}-dot`, `bubble-s2-${month}-dot`, `automation-id-bubble-s2-${month}-dot`));
      });

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
      // no clicky on dots
    });

    it('should not select line group on click in legends', async () => {
      // no clicky on labels
    });
  });
});
