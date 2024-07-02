describe('Empty Message Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/emptymessage';

  describe('Empty message example index tests', () => {
    const url = `${baseUrl}/example-index`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to set ids and automation ids', async () => {
      await page.waitForSelector('#error-loading', { visible: true });

      expect(await page.$eval('#error-loading', el => el.getAttribute('id'))).toBe('error-loading');
      expect(await page.$eval('#error-loading', el => el.getAttribute('data-automation-id'))).toBe('automation-id-error-loading');

      expect(await page.$eval('#empty-generic', el => el.getAttribute('id'))).toBe('empty-generic');
      expect(await page.$eval('#empty-generic', el => el.getAttribute('data-automation-id'))).toBe('automation-id-empty-generic');

      expect(await page.$eval('#new-project', el => el.getAttribute('id'))).toBe('new-project');
      expect(await page.$eval('#new-project', el => el.getAttribute('data-automation-id'))).toBe('automation-id-new-project');

      expect(await page.$eval('#no-alerts', el => el.getAttribute('id'))).toBe('no-alerts');
      expect(await page.$eval('#no-alerts', el => el.getAttribute('data-automation-id'))).toBe('automation-id-no-alerts');

      expect(await page.$eval('#no-analytics', el => el.getAttribute('id'))).toBe('no-analytics');
      expect(await page.$eval('#no-analytics', el => el.getAttribute('data-automation-id'))).toBe('automation-id-no-analytics');

      expect(await page.$eval('#no-budget', el => el.getAttribute('id'))).toBe('no-budget');
      expect(await page.$eval('#no-budget', el => el.getAttribute('data-automation-id'))).toBe('automation-id-no-budget');

      expect(await page.$eval('#no-data', el => el.getAttribute('id'))).toBe('no-data');
      expect(await page.$eval('#no-data', el => el.getAttribute('data-automation-id'))).toBe('automation-id-no-data');

      expect(await page.$eval('#no-events', el => el.getAttribute('id'))).toBe('no-events');
      expect(await page.$eval('#no-events', el => el.getAttribute('data-automation-id'))).toBe('automation-id-no-events');

      expect(await page.$eval('#no-notes', el => el.getAttribute('id'))).toBe('no-notes');
      expect(await page.$eval('#no-notes', el => el.getAttribute('data-automation-id'))).toBe('automation-id-no-notes');

      expect(await page.$eval('#no-orders', el => el.getAttribute('id'))).toBe('no-orders');
      expect(await page.$eval('#no-orders', el => el.getAttribute('data-automation-id'))).toBe('automation-id-no-orders');

      expect(await page.$eval('#no-tasks', el => el.getAttribute('id'))).toBe('no-tasks');
      expect(await page.$eval('#no-tasks', el => el.getAttribute('data-automation-id'))).toBe('automation-id-no-tasks');

      expect(await page.$eval('#no-users', el => el.getAttribute('id'))).toBe('no-users');
      expect(await page.$eval('#no-users', el => el.getAttribute('data-automation-id'))).toBe('automation-id-no-users');

      expect(await page.$eval('#search-data', el => el.getAttribute('id'))).toBe('search-data');
      expect(await page.$eval('#search-data', el => el.getAttribute('data-automation-id'))).toBe('automation-id-search-data');
    });
  });

  describe('Empty message test button click tests', () => {
    const url = `${baseUrl}/test-button-click`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to set id and automation id in root component', async () => {
      expect(await page.$eval('#test-emptymessage-id', el => el.getAttribute('id'))).toBe('test-emptymessage-id');
      expect(await page.$eval('#test-emptymessage-id', el => el.getAttribute('data-automation-id'))).toBe('test-automation-emptymessage');
    });

    it('should be able to set id and automation id in button', async () => {
      expect(await page.$eval('#test-emptymessage-id-btn', el => el.getAttribute('id'))).toBe('test-emptymessage-id-btn');
      expect(await page.$eval('#test-emptymessage-id-btn', el => el.getAttribute('data-automation-id'))).toBe('test-automation-emptymessage-btn');
    });
  });
});
