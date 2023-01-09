const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Calendar Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/calendar';

  describe('Specific Month', () => {
    const url = `${baseUrl}/test-specific-month`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visual regress', async () => {
      await page.waitForSelector('.monthview-table td', { visible: true })
        .then(element => expect(element).toBeTruthy());

      expect(await page.$$eval('.calendar-event-content', el => el.length)).toEqual(17);

      const image = await page.screenshot();
      const config = getConfig('calendar-specific-month');
      await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Only Calendar', () => {
    const url = `${baseUrl}/example-only-calendar`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visual regress', async () => {
      expect(await page.$$eval('.monthview-table td', el => el.length)).toEqual(42);

      const image = await page.screenshot();
      const config = getConfig('calendar-only');
      await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Only Monthview and Legend', () => {
    const url = `${baseUrl}/example-only-calendar-legend`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visual regress', async () => {
      expect(await page.$$eval('.monthview-table td', el => el.length)).toEqual(42);

      const image = await page.screenshot();
      const config = getConfig('calendar-monthview-legend');
      await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('RTL', () => {
    const url = `${baseUrl}/test-specific-month.html?locale=ar-SA&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visual regress', async () => {
      expect(await page.$$eval('.monthview-table td', el => el.length)).toEqual(42);

      const image = await page.screenshot();
      const config = getConfig('calendar-rtl');
      await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
