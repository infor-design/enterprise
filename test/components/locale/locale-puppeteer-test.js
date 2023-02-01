describe('Locale Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/locale';

  describe('Locale date format in Latvian tests', () => {
    const url = `${baseUrl}/test-format-date.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the correct date format for Latvian', async () => {
      await page.evaluate(() => document.querySelector('#date-field5').value)
        .then(value => expect(value).toEqual('05.12.2019.'));
    });
  });
});
