describe('Modal Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/monthview';

  describe('Mothview /Datepicker update legend test', () => {
    const url = `${baseUrl}/test-legend-loaded.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should update legend when visible month changes', async () => {
      await page.click('#update-legend');
      await page.hover('.monthview-legend');
      const legend = await page.waitForSelector('.is-wrapped', { visible: true });
      expect(legend).toBeTruthy();
    });
  });
});
