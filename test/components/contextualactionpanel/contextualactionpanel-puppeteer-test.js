describe('Contextual Action Panel Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/contextualactionpanel';
  const capTrigger = '#cap-trigger';

  describe('CAP Tabs Vertical tests', () => {
    const url = `${baseUrl}/example-cap-tabs-vertical-scroll`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it.skip('should not disable the elements inside of the tab panel when the li is not initially selected', async () => {
      await page.click(`${capTrigger}`);

      await page.waitForSelector('.modal-engaged', { visible: true });

      await page.click('#tab-test-info-a');

      await page.click('#insert-text');
      await page.evaluate(() => document.querySelector('#insert-text').getAttribute('disabled'))
        .then(disabledValue => expect(disabledValue).toEqual(null));

      await page.keyboard.press('Tab');
      await page.evaluate(() => document.querySelector('#insert-text-btn').getAttribute('disabled'))
        .then(disabledValue => expect(disabledValue).toEqual(null));
    });
  });

  describe('CAP css settings', () => {
    const url = `${baseUrl}/test-css-settings.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should have css class', async () => {
      await page.click('#show-cap');

      await page.waitForSelector('.my-custom-panel-test', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });
  });
});
