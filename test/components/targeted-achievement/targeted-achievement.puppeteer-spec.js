const { getConfig } = require('../../helpers/e2e-utils.js');

describe('Targeted Achievement', () => {
  const baseUrl = 'http://localhost:4000/components/targeted-achievement';

  describe('Index', () => {
    const url = `${baseUrl}/example-index`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.setViewport({ width: 1200, height: 800 });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should show the tooltip', async () => {
      const icon = await page.$('.icon-error');
      icon.hover();

      await page.waitForSelector('.tooltip', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

    it('should be able to set id/automation id example one', async () => {
      await page.evaluate(() => document.getElementById('targeted-achievement-example1-name').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('targeted-achievement-example1-name'));
      await page.evaluate(() => document.getElementById('targeted-achievement-example1-name').getAttribute('data-automation-id'))
        .then(idValue => expect(idValue).toEqual('automation-id-targeted-achievement-example1-name'));

      await page.evaluate(() => document.getElementById('targeted-achievement-example1-total-value').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('targeted-achievement-example1-total-value'));
      await page.evaluate(() => document.getElementById('targeted-achievement-example1-total-value').getAttribute('data-automation-id'))
        .then(idValue => expect(idValue).toEqual('automation-id-targeted-achievement-example1-total-value'));

      await page.evaluate(() => document.getElementById('targeted-achievement-example1-total-bar').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('targeted-achievement-example1-total-bar'));
      await page.evaluate(() => document.getElementById('targeted-achievement-example1-total-bar').getAttribute('data-automation-id'))
        .then(idValue => expect(idValue).toEqual('automation-id-targeted-achievement-example1-total-bar'));

      await page.evaluate(() => document.getElementById('targeted-achievement-example1-remaining-bar').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('targeted-achievement-example1-remaining-bar'));
      await page.evaluate(() => document.getElementById('targeted-achievement-example1-remaining-bar').getAttribute('data-automation-id'))
        .then(idValue => expect(idValue).toEqual('automation-id-targeted-achievement-example1-remaining-bar'));

      await page.evaluate(() => document.getElementById('targeted-achievement-example1-completed-bar').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('targeted-achievement-example1-completed-bar'));
      await page.evaluate(() => document.getElementById('targeted-achievement-example1-completed-bar').getAttribute('data-automation-id'))
        .then(idValue => expect(idValue).toEqual('automation-id-targeted-achievement-example1-completed-bar'));

      await page.evaluate(() => document.getElementById('targeted-achievement-example1-completed-text').getAttribute('id'))
        .then(idValue => expect(idValue).toEqual('targeted-achievement-example1-completed-text'));
      await page.evaluate(() => document.getElementById('targeted-achievement-example1-completed-text').getAttribute('data-automation-id'))
        .then(idValue => expect(idValue).toEqual('automation-id-targeted-achievement-example1-completed-text'));
    });

    it.skip('should not visually regress', async () => {
      expect(await page.waitForSelector('.chart-targeted-achievement', { visible: true })).toBeTruthy();

      const mainContent = await page.waitForSelector('#maincontent', { visible: true });
      const image = await mainContent.screenshot();
      const config = getConfig('targeted-achievement');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Links and icons', () => {
    const url = `${baseUrl}/example-links-icons?theme=classic&layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.setViewport({ width: 1200, height: 600 });
    });

    it.skip('should not visually regress', async () => {
      const mainContent = await page.waitForSelector('body', { visible: true });
      const image = await mainContent.screenshot();
      const config = getConfig('targeted-achievement-links-icons');
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
