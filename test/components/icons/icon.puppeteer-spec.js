const { getConfig } = require('../../helpers/e2e-utils.js');

describe('Icons Puppeteer Tests', () => {
  describe('Index', () => {
    const url = 'http://localhost:4000/components/icons/example-index.html';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.setViewport({ width: 1920, height: 1080 });
    });

    it('should have new ids identity for launch icon', async () => {
      // https://github.com/infor-design/enterprise/pull/5596
      const launchIcon = await page.$eval('div.demo-svg[title=launch]', element => element.innerHTML);
      expect(launchIcon).toContain('<use href="#icon-launch"></use>');

      const icon = await page.$('div.demo-svg[title=launch]');
      const image = await icon.screenshot();
      const config = getConfig('icon-launch');
      expect(image).toMatchImageSnapshot(config);
    });

    it('should have new ids identity for mobile icon', async () => {
      // https://github.com/infor-design/enterprise/issues/6144
      const launchIcon = await page.$eval('div.demo-svg[title=mobile]', element => element.innerHTML);
      expect(launchIcon).toContain('<use href="#icon-mobile"></use>');

      const icon = await page.$('div.demo-svg[title=mobile]');
      const image = await icon.screenshot();
      const config = getConfig('icon-mobile');
      expect(image).toMatchImageSnapshot(config);
    });

    it('should have new ids identity for interaction icon', async () => {
      // https://github.com/infor-design/enterprise/issues/6666
      const launchIcon = await page.$eval('div.demo-svg[title=interaction]', element => element.innerHTML);
      expect(launchIcon).toContain('<use href="#icon-interaction"></use>');

      const icon = await page.$('div.demo-svg[title=interaction]');
      const image = await icon.screenshot();
      const config = getConfig('icon-interaction');
      expect(image).toMatchImageSnapshot(config);
    });

    it('should have new ids identity for interaction-reply icon', async () => {
      // https://github.com/infor-design/enterprise/issues/6666
      const launchIcon = await page.$eval('div.demo-svg[title=interaction-reply]', element => element.innerHTML);
      expect(launchIcon).toContain('<use href="#icon-interaction-reply"></use>');

      const icon = await page.$('div.demo-svg[title=interaction-reply]');
      const image = await icon.screenshot();
      const config = getConfig('icon-interaction-reply');
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
