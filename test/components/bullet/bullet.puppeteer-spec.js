/* eslint-disable compat/compat */
const { getConfig } = require('../../helpers/e2e-utils.js');

describe('Bullet Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/bullet';

  const checkAttr = (select, val1, val2) => page.$eval(select, element => [element.id, element.getAttribute('data-automation-id')])
    .then((id) => {
      expect(id[0]).toEqual(val1);
      expect(id[1]).toEqual(val2);
    });

  describe('Index tests', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.waitForFunction('document.querySelectorAll(".bullet .range").length > 0');
    });

    it('should be able to set id/automation id single', async () => {
      await checkAttr('#bullet-example1-title', 'bullet-example1-title', 'automation-id-bullet-example1-title');
      await checkAttr('#bullet-example1-subtitle', 'bullet-example1-subtitle', 'automation-id-bullet-example1-subtitle');
      await checkAttr('#bullet-example1-difference', 'bullet-example1-difference', 'automation-id-bullet-example1-difference');
      await checkAttr('#bullet-example1-marker', 'bullet-example1-marker', 'automation-id-bullet-example1-marker');

      await checkAttr('#bullet-example1-measure0', 'bullet-example1-measure0', 'automation-id-bullet-example1-measure0');
      await checkAttr('#bullet-example1-measure1', 'bullet-example1-measure1', 'automation-id-bullet-example1-measure1');

      await checkAttr('#bullet-example1-range0', 'bullet-example1-range0', 'automation-id-bullet-example1-range0');
      await checkAttr('#bullet-example1-range1', 'bullet-example1-range1', 'automation-id-bullet-example1-range1');
      await checkAttr('#bullet-example1-range2', 'bullet-example1-range2', 'automation-id-bullet-example1-range2');
      await checkAttr('#bullet-example1-range3', 'bullet-example1-range3', 'automation-id-bullet-example1-range3');
      await checkAttr('#bullet-example1-range4', 'bullet-example1-range4', 'automation-id-bullet-example1-range4');
    });

    it.skip('should not visual regress', async () => {
      const img = await page.screenshot();
      const sConfig = getConfig('bullet');
      expect(img).toMatchImageSnapshot(sConfig);
    });
  });

  describe('Data group tests', () => {
    const url = `${baseUrl}/example-data-group?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it.skip('should not visual regress', async () => {
      const img = await page.screenshot();
      const sConfig = getConfig('bullet-data-group');
      expect(img).toMatchImageSnapshot(sConfig);
    });
  });

  describe('Data group automation tests', () => {
    const url = `${baseUrl}/test-data-group-automation?layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.waitForFunction('document.querySelectorAll(".bullet .range").length > 0');
    });

    it('should be able to set id/automation id grouped', async () => {
      const promises = [];

      for (let i = 0; i < 4; i++) {
        promises.push(checkAttr(`#bullet-group-example1-title-group${i}`, `bullet-group-example1-title-group${i}`, `automation-id-bullet-group-example1-title-group${i}`));
        promises.push(checkAttr(`#bullet-group-example1-subtitle-group${i}`, `bullet-group-example1-subtitle-group${i}`, `automation-id-bullet-group-example1-subtitle-group${i}`));
        promises.push(checkAttr(`#bullet-group-example1-difference-group${i}`, `bullet-group-example1-difference-group${i}`, `automation-id-bullet-group-example1-difference-group${i}`));
        promises.push(checkAttr(`#bullet-group-example1-marker-group${i}`, `bullet-group-example1-marker-group${i}`, `automation-id-bullet-group-example1-marker-group${i}`));

        promises.push(checkAttr(`#bullet-group-example1-measure0-group${i}`, `bullet-group-example1-measure0-group${i}`, `automation-id-bullet-group-example1-measure0-group${i}`));
        promises.push(checkAttr(`#bullet-group-example1-measure1-group${i}`, `bullet-group-example1-measure1-group${i}`, `automation-id-bullet-group-example1-measure1-group${i}`));

        promises.push(checkAttr(`#bullet-group-example1-range0-group${i}`, `bullet-group-example1-range0-group${i}`, `automation-id-bullet-group-example1-range0-group${i}`));
        promises.push(checkAttr(`#bullet-group-example1-range1-group${i}`, `bullet-group-example1-range1-group${i}`, `automation-id-bullet-group-example1-range1-group${i}`));
        promises.push(checkAttr(`#bullet-group-example1-range2-group${i}`, `bullet-group-example1-range2-group${i}`, `automation-id-bullet-group-example1-range2-group${i}`));
      }

      await Promise.all(promises);
    });
  });

  describe('Negative positive tests', () => {
    const url = `${baseUrl}/test-negative-positive-value?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it.skip('should not visual regress', async () => {
      const img = await page.screenshot();
      const sConfig = getConfig('bullet-negative-positive');
      expect(img).toMatchImageSnapshot(sConfig);
    });
  });

  describe('Negative values tests', () => {
    const url = `${baseUrl}/test-negative-value?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it.skip('should not visual regress', async () => {
      const img = await page.screenshot();
      const sConfig = getConfig('bullet-negative');
      expect(img).toMatchImageSnapshot(sConfig);
    });
  });
});
