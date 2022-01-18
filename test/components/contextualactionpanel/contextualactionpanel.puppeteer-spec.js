describe('Contextual Action Panel Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/contextualactionpanel';
  const capTrigger = '#cap-trigger';

  describe('CAP Tabs Vertical tests', () => {
    const url = `${baseUrl}/example-cap-tabs-vertical-scroll`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not disable the elements inside of the tab panel when the li is not initially selected', async () => {
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
});
