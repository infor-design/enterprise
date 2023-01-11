const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Week View Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/week-view';

  describe('WeekView Events Tests', () => {
    const url = `${baseUrl}/test-events?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });

      expect(await page.waitForSelector('.week-view')).toBeTruthy();

      // Need a bit of delay to show the modal perfectly
      await page.waitForTimeout(200);

      // Screenshot of the page
      const image = await page.screenshot();

      // Set a custom name of the snapshot
      const config = getConfig('week-view-events');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('WeekView Loading Tests', () => {
    const url = `${baseUrl}/test-ajax-events?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });

      expect(await page.waitForSelector('.week-view')).toBeTruthy();

      // Need a bit of delay to show the modal perfectly
      await page.waitForTimeout(200);

      // Screenshot of the page
      const image = await page.screenshot();

      // Set a custom name of the snapshot
      const config = getConfig('week-view-loading');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('WeekView Two Weeks Tests', () => {
    const url = `${baseUrl}/example-two-weeks?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });

      expect(await page.waitForSelector('.week-view')).toBeTruthy();

      // Need a bit of delay to show the modal perfectly
      await page.waitForTimeout(200);

      // Screenshot of the page
      const image = await page.screenshot();

      // Set a custom name of the snapshot
      const config = getConfig('week-view-two-weeks');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('WeekView One Day Tests', () => {
    const url = `${baseUrl}/example-one-day?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });

      expect(await page.waitForSelector('.week-view')).toBeTruthy();

      // Need a bit of delay to show the modal perfectly
      await page.waitForTimeout(200);

      // Screenshot of the page
      const image = await page.screenshot();

      // Set a custom name of the snapshot
      const config = getConfig('week-view-one-day');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('WeekView Two Day Tests', () => {
    const url = `${baseUrl}/example-two-day?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });

      expect(await page.waitForSelector('.week-view')).toBeTruthy();

      // Need a bit of delay to show the modal perfectly
      await page.waitForTimeout(200);

      // Screenshot of the page
      const image = await page.screenshot();

      // Set a custom name of the snapshot
      const config = getConfig('week-view-two-day');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('WeekView Specific Month Tests', () => {
    const url = `${baseUrl}/test-specific-week?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });

      expect(await page.waitForSelector('.week-view')).toBeTruthy();

      // Need a bit of delay to show the modal perfectly
      await page.waitForTimeout(200);

      // Screenshot of the page
      const image = await page.screenshot();

      // Set a custom name of the snapshot
      const config = getConfig('week-specific-week');
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
