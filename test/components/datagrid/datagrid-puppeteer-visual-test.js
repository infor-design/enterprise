const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Datagrid Pupetteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/datagrid';

  describe('Index', () => {
    const url = `${baseUrl}/example-index.html`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should run visual test in responsive view', async () => {
      await page.setViewport({ width: 900, height: 600 });
      await page.waitForSelector('#custom-id-col-phone');
      const img = await page.screenshot();
      const config = getConfig('datagrid-col');
      expect(img).toMatchImageSnapshot(config);
    });
  });
});
