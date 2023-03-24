const { getConfig } = require('../../helpers/e2e-utils.js');

describe('Colors Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/colors';

  describe('Colors Classic Tests', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it.skip('should not visual regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });

      expect(await page.waitForSelector('.palette-grid')).toBeTruthy();

      const image = await page.screenshot();
      const config = getConfig('color-index-classic');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Colors New Theme Tests', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it.skip('should not visual regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });

      expect(await page.waitForSelector('.palette-grid')).toBeTruthy();

      const image = await page.screenshot();
      const config = getConfig('color-index-new-theme');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Status color and border tests', () => {
    const url = `${baseUrl}/example-index`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should have classes for status color borders', async () => {
      const color1 = await page.$eval('#maincontent > div:nth-child(5) > .palette-column:nth-child(1) > div', el => el.getAttribute('class'));
      const color2 = await page.$eval('#maincontent > div:nth-child(5) > .palette-column:nth-child(2) > div', el => el.getAttribute('class'));
      const color3 = await page.$eval('#maincontent > div:nth-child(5) > .palette-column:nth-child(3) > div', el => el.getAttribute('class'));
      const color4 = await page.$eval('#maincontent > div:nth-child(5) > .palette-column:nth-child(4) > div', el => el.getAttribute('class'));
      const color5 = await page.$eval('#maincontent > div:nth-child(5) > .palette-column:nth-child(5) > div', el => el.getAttribute('class'));

      expect(color1).toContain('status-01-border');
      expect(color2).toContain('status-02-border');
      expect(color3).toContain('status-03-border');
      expect(color4).toContain('status-04-border');
      expect(color5).toContain('status-05-border');
    });

    it('should have classes for status colors for svg', async () => {
      const svgcolor1 = await page.$eval('#maincontent > div:nth-child(7) > .palette-column:nth-child(1) > div > svg', el => el.getAttribute('class'));
      const svgcolor2 = await page.$eval('#maincontent > div:nth-child(7) > .palette-column:nth-child(2) > div > svg', el => el.getAttribute('class'));
      const svgcolor3 = await page.$eval('#maincontent > div:nth-child(7) > .palette-column:nth-child(3) > div > svg', el => el.getAttribute('class'));
      const svgcolor4 = await page.$eval('#maincontent > div:nth-child(7) > .palette-column:nth-child(4) > div > svg', el => el.getAttribute('class'));
      const svgcolor5 = await page.$eval('#maincontent > div:nth-child(7) > .palette-column:nth-child(5) > div > svg', el => el.getAttribute('class'));

      expect(svgcolor1).toContain('status-01-color');
      expect(svgcolor2).toContain('status-02-color');
      expect(svgcolor3).toContain('status-03-color');
      expect(svgcolor4).toContain('status-04-color');
      expect(svgcolor5).toContain('status-05-color');
    });
  });
});
