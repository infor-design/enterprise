describe('Accordion Puppeteer Test', () => {
  describe('Allow One Pane', () => {
    const url = 'http://localhost:4000/components/accordion/example-allow-one-pane';

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('Should only allow one pane open at a time', async () => {
      expect((await page.$$('.accordion-pane.is-expanded')).length).toEqual(0);

      await page.click('#accordion-one-pane > div:nth-child(1) button');

      page.waitForSelector('#accordion-one-pane .accordion-pane.is-expanded', { visible: true });

      expect((await page.$$('.accordion-pane.is-expanded')).length).toEqual(1);
    });
  });
});
