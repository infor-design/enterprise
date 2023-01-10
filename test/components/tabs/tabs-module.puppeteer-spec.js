const { dragAndDrop } = require('../../helpers/e2e-utils.cjs');
const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Tabs module Puppeteer tests', () => {
  const baseUrl = 'http://localhost:4000/components/tabs-module';
  describe('Tabs module example-sortable tests', () => {
    const url = `${baseUrl}/example-sortable.html`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to sort tabs', async () => {
      const verifyDragnDrop = async () => {
        const tab1 = await page.$('#module-tabs-example > div > ul > li.tab.is-selected.draggable');
        const tab3 = await page.$('#module-tabs-example > div > ul > li:nth-child(4)');
        await dragAndDrop(tab1, tab3);
        if (dragAndDrop) return true;
        return false;
      };
      expect(await verifyDragnDrop()).toBeTruthy();
    });
  });

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
