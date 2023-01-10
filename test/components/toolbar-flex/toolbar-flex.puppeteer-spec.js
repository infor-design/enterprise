const { getConfig } = require('../../helpers/e2e-utils.cjs');

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

    it.skip('should not visually regress', async () => {
      await page.waitForSelector('.no-frills', { visible: true })
        .then(element => expect(element).toBeTruthy());

      const button = await page.$('button#menu-button');
      await button.click();

      await page.waitForSelector('#menu-button-popupmenu', { visible: true })
        .then(element => expect(element).toBeTruthy());

      const image = await page.screenshot();
      const config = getConfig('flextool-index-open-menu-button-submenu');

      expect(image).toMatchImageSnapshot(config);

      const subMenu = await page.$('#menu-button-popupmenu li.submenu');
      await subMenu.hover();

      await page.waitForSelector('#flex-toolbar-menu-button-submenu', { visible: true })
        .then(element => expect(element).toBeTruthy());

      const image2 = await page.screenshot();
      const config2 = getConfig('flextool-index-open-menu-button-with-submenu');

      expect(image2).toMatchImageSnapshot(config2);

      const buttonActions = await page.$('button.btn-actions');
      await buttonActions.click();

      await page.waitForSelector('#popupmenu-2', { visible: true })
        .then(element => expect(element).toBeTruthy());

      const image3 = await page.screenshot();
      const config3 = getConfig('flextool-index-open-more-menu');

      expect(image3).toMatchImageSnapshot(config3);
    });

    it.skip('should not visually regress - windowed', async () => {
      await page.setViewport({ width: 450, height: 1000 });
      await page.waitForSelector('.no-frills', { visible: true })
        .then(element => expect(element).toBeTruthy());

      const button = await page.$('button#menu-button');
      await button.click();

      await page.waitForSelector('#menu-button-popupmenu', { visible: true })
        .then(element => expect(element).toBeTruthy());

      const image = await page.screenshot();
      const config = getConfig('flextool-index-open-menu-button-submenu-windowed');

      expect(image).toMatchImageSnapshot(config);

      const subMenu = await page.$('#menu-button-popupmenu li.submenu');
      await subMenu.hover();

      await page.waitForSelector('#flex-toolbar-menu-button-submenu', { visible: true })
        .then(element => expect(element).toBeTruthy());

      const image2 = await page.screenshot();
      const config2 = getConfig('flextool-index-open-menu-button-with-submenu-windowed');

      expect(image2).toMatchImageSnapshot(config2);

      const buttonActions = await page.$('button.btn-actions');
      await buttonActions.click();

      await page.waitForSelector('#popupmenu-2', { visible: true })
        .then(element => expect(element).toBeTruthy());

      const image3 = await page.screenshot();
      const config3 = getConfig('flextool-index-open-more-menu-windowed');

      expect(image3).toMatchImageSnapshot(config3);
    });
  });
});
