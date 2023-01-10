const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Week View Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/week-view';

  describe('WeekView Index Tests', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should render without error', async () => {
      await page.waitForSelector('.week-view-table th', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

    it('should be able to set id/automation id', async () => {
      expect(await page.$eval('#custom-id-week-view-btn-prev', el => el.getAttribute('id'))).toBe('custom-id-week-view-btn-prev');
      expect(await page.$eval('#custom-id-week-view-btn-prev', el => el.getAttribute('data-automation-id'))).toBe('custom-automation-id-week-view-btn-prev');

      expect(await page.$eval('#custom-id-week-view-btn-next', el => el.getAttribute('id'))).toBe('custom-id-week-view-btn-next');
      expect(await page.$eval('#custom-id-week-view-btn-next', el => el.getAttribute('data-automation-id'))).toBe('custom-automation-id-week-view-btn-next');

      expect(await page.$eval('#custom-id-week-view-datepicker', el => el.getAttribute('id'))).toBe('custom-id-week-view-datepicker');
      expect(await page.$eval('#custom-id-week-view-datepicker', el => el.getAttribute('data-automation-id'))).toBe('custom-automation-id-week-view-datepicker');

      expect(await page.$eval('#custom-id-week-view-datepicker-trigger', el => el.getAttribute('id'))).toBe('custom-id-week-view-datepicker-trigger');
      expect(await page.$eval('#custom-id-week-view-datepicker-trigger', el => el.getAttribute('data-automation-id'))).toBe('custom-automation-id-week-view-datepicker-trigger');

      expect(await page.$eval('#custom-id-week-view-today', el => el.getAttribute('id'))).toBe('custom-id-week-view-today');
      expect(await page.$eval('#custom-id-week-view-today', el => el.getAttribute('data-automation-id'))).toBe('custom-automation-id-week-view-today');
    });

    it.skip('Should be able to reset the date today', async () => {
      const validateYear = ` ${new Date().getFullYear()}`;

      await page.click('.trigger');
      await page.waitForSelector('.monthview-container', { visible: true })
        .then(element => expect(element).toBeTruthy());

      await page.click('.btn-monthyear-pane');
      await page.click('.picklist.is-year > li:nth-child(6)');
      await page.waitForSelector('.is-select-month-pane', { visible: true })
        .then(element => expect(element).toBeTruthy());

      await page.click('.is-select-month-pane');
      await page.click('.is-select');
      expect(await page.$eval('.hidden.year', el => el.innerHTML)).not.toBe(validateYear);

      await page.click('.today');
      expect(await page.$eval('.hidden.year', el => el.innerHTML)).toBe(validateYear);
    });
  });

  describe('WeekView Events Tests', () => {
    const url = `${baseUrl}/test-events?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should render without error', async () => {
      await page.waitForSelector('.calendar-event', { visible: true })
        .then(element => expect(element).toBeTruthy());
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

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should render without error', async () => {
      await page.waitForSelector('.calendar-event', { visible: true })
        .then(element => expect(element).toBeTruthy());
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

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should render without error', async () => {
      await page.waitForSelector('.week-view-table th', { visible: true })
        .then(element => expect(element).toBeTruthy());
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

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should render without error', async () => {
      await page.waitForSelector('.week-view-table th', { visible: true })
        .then(element => expect(element).toBeTruthy());
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

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should render without error', async () => {
      await page.waitForSelector('.week-view-table th', { visible: true })
        .then(element => expect(element).toBeTruthy());
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
