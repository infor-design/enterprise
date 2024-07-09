describe('Track Dirty Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/input';

  describe('Track Dirty Tests', () => {
    const url = `${baseUrl}/example-track-dirty`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should reset the trackdirty', async () => {
      await page.type('#department-code-trackdirty', 't');
      await page.keyboard.press('Tab');
      await page.focus('#department-code-trackdirty.dirty');
      await page.keyboard.press('Backspace');
      await page.keyboard.press('Tab');

      await page.waitForSelector('#department-code-trackdirty', { visible: true })
        .then(element => element.getProperty('className'))
        .then(className => className.jsonValue())
        .then(classNameValue => expect(classNameValue).not.toContain('dirty'));
    });

    it('should trigger the trackdirty', async () => {
      await page.type('#department-code-trackdirty', 't');
      await page.keyboard.press('Tab');

      await page.waitForSelector('#department-code-trackdirty', { visible: true })
        .then(element => element.getProperty('className'))
        .then(className => className.jsonValue())
        .then(classNameValue => expect(classNameValue).toContain('dirty'));
    });
  });
});
