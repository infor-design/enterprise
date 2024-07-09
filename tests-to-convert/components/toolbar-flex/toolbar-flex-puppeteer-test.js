describe('Flex Toolbar', () => {
  const baseUrl = 'http://localhost:4000/components/toolbar-flex';

  describe('Index', () => {
    const url = `${baseUrl}/example-more-actions-ajax?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should render without error', async () => {
      await page.waitForSelector('#flex-toolbar', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });
  });
});
