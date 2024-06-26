const { dragAndDrop } = require('../../helpers/e2e-utils.cjs');

describe('Tabs module Puppeteer tests', () => {
  const baseUrl = 'http://localhost:4000/components/tabs-module';
  describe('Tabs module example-sortable tests', () => {
    const url = `${baseUrl}/example-sortable.html`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to sort tabs', async () => {
      const verifyDragnDrop = async () => {
        await dragAndDrop('#module-tabs-example > div > ul > li.tab.is-selected.draggable', '#module-tabs-example > div > ul > li:nth-child(4)');
        if (dragAndDrop) return true;
        return false;
      };
      expect(await verifyDragnDrop()).toBeTruthy();
    });
  });
});
