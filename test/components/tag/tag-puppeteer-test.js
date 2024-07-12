describe('Tag Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/tag';

  describe('Linkable', () => {
    const url = `${baseUrl}/example-linkable`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should display caret right icon correctly', async () => {
      expect(await page.waitForSelector('#linkable-tag', { visible: true })).toBeTruthy();
      expect(await page.waitForSelector('.tag-list .is-linkable > a + .btn-linkable', { visible: true })).toBeTruthy();
    });
  });
});
