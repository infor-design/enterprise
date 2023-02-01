const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Cards Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/cards';

  describe('Group Action', () => {
    const url = `${baseUrl}/example-group-action`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.waitForSelector('.card-group-action', { visible: true })
        .then(element => expect(element).toBeTruthy());

      const image = await page.screenshot();
      const config = getConfig('cards-group-action');

      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Menu Button', () => {
    const url = `${baseUrl}/example-menubutton`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.waitForSelector('#category-button', { visible: true })
        .then(element => expect(element).toBeTruthy());

      const button = await page.$('#category-button');
      await button.click();

      const image = await page.screenshot();
      const config = getConfig('cards-menu-button');

      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Single Select', () => {
    const url = `${baseUrl}/example-single-select`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.waitForSelector('.card', { visible: true })
        .then(element => expect(element).toBeTruthy());

      const button = await page.$('.card:nth-child(1)');
      await button.click();

      const image = await button.screenshot();
      const config = getConfig('cards-single-select');

      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Multi Select', () => {
    const url = `${baseUrl}/example-multi-select`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it.skip('should not visually regress', async () => {
      await page.waitForSelector('.card', { visible: true })
        .then(element => expect(element).toBeTruthy());

      const button1 = await page.$('.card:nth-child(1)');
      await button1.click();

      const button2 = await page.$('.card:nth-child(2)');
      await button2.click();

      const window = await page.$('#cardlist');
      const image = await window.screenshot();
      const config = getConfig('cards-multi-select');

      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Actionable', () => {
    const url = `${baseUrl}/example-actionable`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.setViewport({ width: 1920, height: 1080 });
    });

    it('should not visually regress', async () => {
      await page.waitForSelector('.btn');
      await page.click('#actionable-btn-1');

      await page.keyboard.press('Tab');
      await page.hover('#actionable-btn-2');

      const image = await page.screenshot();
      const config = getConfig('cards-actionbutton');

      expect(image).toMatchImageSnapshot(config);
    });
  });
});
