const { getConfig } = require('../../helpers/e2e-utils');

describe('Tag', () => {
  const baseUrl = 'http://localhost:4000/components/tag';

  describe('Index', () => {
    const url = `${baseUrl}/example-index`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.waitForSelector('#maincontent', { visible: true });

      const mainContent = await page.$('#maincontent');
      const image = mainContent.screenshot();
      const config = getConfig('tag-index');
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
