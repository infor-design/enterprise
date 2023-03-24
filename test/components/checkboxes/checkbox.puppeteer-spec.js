const { getConfig } = require('../../helpers/e2e-utils.js');

describe('Checkbox Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/checkboxes';

  describe('Index Tests', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it.skip('should not visual regress', async () => {
      expect(await page.waitForSelector('div[role=main]')).toBeTruthy();

      const image = await page.screenshot();
      const config = getConfig('checkboxes');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('New Theme Tests', () => {
    const url = `${baseUrl}/example-index?theme=new&layout=nofrills`;
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it.skip('should not visual regress', async () => {
      expect(await page.waitForSelector('div[role=main]')).toBeTruthy();

      const image = await page.screenshot();
      const config = getConfig('checkboxes-new');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Group Tests', () => {
    const url = `${baseUrl}/example-checkbox-groups?theme=classic&layout=nofrills`;
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it.skip('should not visual regress', async () => {
      expect(await page.waitForSelector('div[role=main]')).toBeTruthy();

      const image = await page.screenshot();
      const config = getConfig('checkbox-groups');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Horizontal checkbox group Tests', () => {
    const url = `${baseUrl}/example-horizontal?theme=classic&layout=nofrills`;
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it.skip('should not visual regress', async () => {
      expect(await page.waitForSelector('div[role=main]')).toBeTruthy();

      const image = await page.screenshot();
      const config = getConfig('checkboxes-horizontal');
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
