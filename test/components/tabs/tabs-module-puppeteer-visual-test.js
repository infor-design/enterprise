const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Tabs module Puppeteer Visual tests', () => {
  const baseUrl = 'http://localhost:4000/components/tabs-module';

  describe('Tabs Module Searchfield close icon tests', () => {
    const url = `${baseUrl}/example-category-searchfield.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      // Add an opening delay just in case
      await page.waitForTimeout(200);

      // Wait for the element to be visible
      page.waitForSelector('.searchfield', { visible: true });

      // Click the searchfield
      await page.click('.searchfield');

      // Add a delay before pressing a key
      await page.waitForTimeout(200);

      // Press a key to enter into the input
      page.keyboard.press('a');

      // Add another delay before taking the screenshot
      await page.waitForTimeout(200);

      // Screenshot of the page
      const image = await page.screenshot();

      // Set a custom name of the snapshot
      const config = getConfig('tabs-module');

      // Compare the images
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Tabs module new searchfield design tests', () => {
    const url = `${baseUrl}/example-category-searchfield-go-button-home.html?theme=new&mode=light`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it.skip('should not visually regress', async () => {
      const search = await page.$('.buttonset');
      const img = await search.screenshot();
      const config = getConfig('new-searchfield-design');
      expect(img).toMatchImageSnapshot(config);
    });
  });
});
