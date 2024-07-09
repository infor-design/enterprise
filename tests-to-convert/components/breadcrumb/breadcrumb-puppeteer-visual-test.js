const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Breadcrumb Puppeteer Visual tests', () => {
  const baseUrl = 'http://localhost:4000/components/breadcrumb';

  const waitForBreadcrumb = () => page.waitForFunction('document.querySelectorAll("div[role=main]").length > 0');

  describe('Index tests', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should not visually regress', async () => {
      await waitForBreadcrumb();
      const img = await page.screenshot();
      const sConfig = getConfig('breadcrumb');
      expect(img).toMatchImageSnapshot(sConfig);
    });
  });

  describe('Text tests', () => {
    const url = `${baseUrl}/example-current-as-link?theme=classic&layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should not visually regress', async () => {
      await waitForBreadcrumb();
      const img = await page.screenshot();
      const sConfig = getConfig('breadcrumb-text');
      expect(img).toMatchImageSnapshot(sConfig);
    });
  });

  describe('Navigation alternate tests', () => {
    const url = `${baseUrl}/example-navigation-breadcrumbs-alternate?theme=classic&layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should not visually regress', async () => {
      await waitForBreadcrumb();
      const img = await page.screenshot();
      const sConfig = getConfig('breadcrumb-alternate');
      expect(img).toMatchImageSnapshot(sConfig);
    });
  });

  describe('Disabled breadcrumb navigation tests', () => {
    const url = `${baseUrl}/example-disabled?theme=classic&layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should not visually regress', async () => {
      await page.waitForFunction('document.querySelectorAll("div[class=row]").length > 0');
      const img = await page.screenshot();
      const sConfig = getConfig('breadcrumb-disabled');
      expect(img).toMatchImageSnapshot(sConfig);
    });
  });
});
