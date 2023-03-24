const { getConfig } = require('../../helpers/e2e-utils.js');

describe('Cards', () => {
  const baseUrl = 'http://localhost:4000/components/cards';

  describe('Index', () => {
    const url = `${baseUrl}/example-index`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should show the card', async () => {
      await page.waitForSelector('.card', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });
  });

  describe('Action Menu Button', () => {
    const url = `${baseUrl}/example-action-menu-button`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the widget', async () => {
      await page.waitForSelector('.widget', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });
  });

  describe('Auto Size', () => {
    const url = `${baseUrl}/example-auto-size`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the card', async () => {
      await page.waitForSelector('.card.auto-height', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });
  });

  describe('Expandable', () => {
    const url = `${baseUrl}/example-expandable`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the card', async () => {
      await page.waitForSelector('.card.expandable-area', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

    it('should should expand', async () => {
      await page.waitForSelector('.card.expandable-area', { visible: true })
        .then(element => expect(element).toBeTruthy());

      const button = await page.$('.btn-expander');
      await button.click();

      await page.waitForSelector('.card.expandable-area.is-expanded', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });
  });

  describe('Four By Four', () => {
    const url = `${baseUrl}/example-four-by-four`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the card', async () => {
      await page.waitForSelector('.card', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });
  });

  describe('Group Action', () => {
    const url = `${baseUrl}/example-group-action`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the card', async () => {
      await page.waitForSelector('.card', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

    it('should show the group action class', async () => {
      await page.waitForSelector('.card-group-action', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

    it.skip('should not visual regress', async () => {
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

    it('should show the card', async () => {
      await page.waitForSelector('.card', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

    it('should show the menu button', async () => {
      await page.waitForSelector('#category-button', { visible: true })
        .then(element => expect(element).toBeTruthy());

      const button = await page.$('#category-button');
      await button.click();

      await page.waitForSelector('#sales', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

    it.skip('should not visual regress', async () => {
      await page.waitForSelector('#category-button', { visible: true })
        .then(element => expect(element).toBeTruthy());

      const button = await page.$('#category-button');
      await button.click();

      const image = await page.screenshot();
      const config = getConfig('cards-menu-button');

      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Variations and Hitboxes', () => {
    const url = `${baseUrl}/example-variations-hitboxes`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the card', async () => {
      await page.waitForSelector('.card', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

    it('should show the card with status item', async () => {
      await page.waitForSelector('.card-content-status.success', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

    it('should show the card with status account', async () => {
      await page.waitForSelector('.header-status.available', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

    it('should show the card with hyperlink', async () => {
      await page.waitForSelector('.hyperlink', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

    it('should show the card with photo', async () => {
      await page.waitForSelector('.card-image', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

    it('should show the card with content action', async () => {
      await page.waitForSelector('.card-content-action', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });
  });

  describe('Single Select', () => {
    const url = `${baseUrl}/example-single-select`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the card', async () => {
      await page.waitForSelector('.card', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

    it('should select a card', async () => {
      await page.waitForSelector('.card', { visible: true })
        .then(element => expect(element).toBeTruthy());

      const button = await page.$('.card:nth-child(1)');
      await button.click();

      expect(await page.$eval('.card:nth-child(1)', el => el.getAttribute('class'))).toBe('card auto-height is-selectable is-selected');
    });

    it.skip('should not visual regress', async () => {
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

    it('should show the card', async () => {
      await page.waitForSelector('.card', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

    it('should select multiple card', async () => {
      await page.waitForSelector('.card', { visible: true })
        .then(element => expect(element).toBeTruthy());

      const button1 = await page.$('.card:nth-child(1)');
      await button1.click();

      const button2 = await page.$('.card:nth-child(2)');
      await button2.click();

      expect(await page.$eval('.card:nth-child(1)', el => el.getAttribute('class'))).toBe('card auto-height is-selectable is-selected');
      expect(await page.$eval('.card:nth-child(2)', el => el.getAttribute('class'))).toBe('card auto-height is-selectable is-selected');
    });

    it.skip('should not visual regress', async () => {
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

    it.skip('should not visual regress', async () => {
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
