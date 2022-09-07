describe('Tooltip Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/popupmenu';

  describe('Multi Selectable', () => {
    const url = `${baseUrl}/example-multi-selectable`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should render without error', async () => {
      await page.waitForSelector('#popupmenu-trigger', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

    it('should be able to select', async () => {
      const popupMenu = await page.$('#popupmenu-trigger');
      const btnSelected = await page.$('#btn-selected');

      expect(await page.$eval('#popup-display', el => el.innerHTML)).toBe('Popupmenu # of Selected: 0');
      await btnSelected.click();

      expect(await page.$eval('#popup-display', el => el.innerHTML)).toBe('Popupmenu # of Selected: 1');
      await popupMenu.click();

      const listItem = await page.$('li.is-multiselectable:nth-child(1)');
      await listItem.click();

      await page.keyboard.press('Escape');
      await btnSelected.click();

      expect(await page.$eval('#popup-display', el => el.innerHTML)).toBe('Popupmenu # of Selected: 2');
    });
  });
});
