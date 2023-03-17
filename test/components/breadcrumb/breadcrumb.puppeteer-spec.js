const { getConfig } = require('../../helpers/e2e-utils.js');

describe('Breadcrumb puppeteer tests', () => {
  const baseUrl = 'http://localhost:4000/components/breadcrumb';

  const waitForBreadcrumb = () => page.waitForFunction('document.querySelectorAll("div[role=main]").length > 0');

  describe('Index tests', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should not visual regress', async () => {
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

    it('should not visual regress', async () => {
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

    it('should not visual regress', async () => {
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

    it.skip('should be accessible with no WCAG 2AA violations', async () => {
      // disabled viewport check because user-scalable is set to 0 in environment.js
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
    });

    it('should not visual regress', async () => {
      await page.waitForFunction('document.querySelectorAll("div[class=row]").length > 0');
      const img = await page.screenshot();
      const sConfig = getConfig('breadcrumb-disabled');
      expect(img).toMatchImageSnapshot(sConfig);
    });
  });

  describe('Automation tests', () => {
    const url = `${baseUrl}/example-from-settings?layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should create automation IDs from settings', async () => {
      await page.$eval('#test-breadcrumb-home', element => element.getAttribute('data-automation-id')).then(id => expect(id).toEqual('test-breadcrumb-home'));
      await page.$eval('.breadcrumb-item.current a', element => element.getAttribute('data-automation-id')).then(id => expect(id).toEqual('test-breadcrumb-fourth'));
    });
  });

  describe('Hitbox tests', () => {
    const url = `${baseUrl}/example-with-hitbox.html`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should have the size of 44px in height, 8px padding-right & 16px font-size in header flex & with hitbox section ', async () => {
      await page.$eval('a[class="hyperlink hide-focus"]', el => ({
        headFlex: getComputedStyle(el, ':after').height,
        padRight: getComputedStyle(el, ':after').paddingRight,
        padLeft: getComputedStyle(el, ':after').paddingLeft,
        fontSize: getComputedStyle(el, ':after').fontSize
      })).then(({ headFlex, padRight, padLeft, fontSize }) => {
        expect(headFlex).toMatch('44px');
        expect(padRight).toMatch('8px');
        expect(padLeft).toMatch('8px');
        expect(fontSize).toMatch('16px');
      });
    });
  });
});
