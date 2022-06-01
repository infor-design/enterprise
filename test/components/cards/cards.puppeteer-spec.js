const { getConfig } = require('../../helpers/e2e-utils.js');

describe('Cards Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/cards';

  describe('Cards example expandable tests', () => {
    const url = `${baseUrl}/example-expandable-cards.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should be expandable card', async () => {
      expect(await page.waitForSelector('.expandable-card')).toBeTruthy();
      expect(await page.waitForSelector('.expandable-card-header')).toBeTruthy();
    });
  });

  describe('Cards example single select tests', () => {
    const url = `${baseUrl}/example-single-select.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });
  });

  describe('Cards example multi select tests', () => {
    const url = `${baseUrl}/example-multi-select.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });
  });

  describe('Cards example variation hitboxes tests', () => {
    const url = `${baseUrl}/example-variations-hitboxes.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });
  });

  describe('Cards actionable button tests', () => {
    const url = `${baseUrl}/example-actionable.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.setViewport({ width: 1920, height: 1080 });
    });
    
    it('should run visual test', async () => {
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
