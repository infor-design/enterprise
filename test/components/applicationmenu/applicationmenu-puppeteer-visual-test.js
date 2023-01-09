/* eslint-disable compat/compat */
const { getConfig } = require('../../helpers/e2e-utils.cjs');

describe('Application Menu Puppeteer Visual Tests', () => {
  const baseUrl = 'http://localhost:4000/components/applicationmenu';

  describe('Index', () => {
    const url = `${baseUrl}/example-index?theme=classic`;

    beforeEach(async () => {
      await page.goto(url, { waitUnitl: ['domcontentloaded', 'networkidle2'] });
    });

    it('should not visual regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });
      const button = await page.waitForSelector('.application-menu-trigger', { visible: true });
      await button.click();

      const isOpen = await page.waitForSelector('.application-menu.is-open', { visible: true });
      await page.waitForTimeout(800); // needed for the animation transition to finish before the screenshot

      if (isOpen) {
        const image = await page.screenshot();
        const config = getConfig('applicationmenu');
        expect(image).toMatchImageSnapshot(config);
      }
    });
  });

  describe('Filter', () => {
    const url = `${baseUrl}/example-filterable?theme=classic`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should not visually regress when filtered', async () => {
      const search = await page.waitForSelector('#appmenu-searchfield', { visible: true });
      await search.click();
      await page.type('#appmenu-searchfield', '#3');

      await page.waitForSelector('.has-filtered-children', { visible: true })
        .then(async () => {
          // target a specific element in the page to screenshot
          const appmenu = await page.$('#application-menu');
          const image = await appmenu.screenshot();
          const config = getConfig('applicationmenu-filtered');
          expect(image).toMatchImageSnapshot(config);
        });
    });
  });

  describe('Personalize', () => {
    const url = `${baseUrl}/example-personalized?theme=classic`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should not visually regress when personalized', async () => {
      await page.setViewport({ width: 1280, height: 718 });
      await page.waitForSelector('body.no-scroll', { visible: true })
        .then(async () => {
          const image = await page.screenshot();
          const config = getConfig('applicationmenu-personalize');
          expect(image).toMatchImageSnapshot(config);
        });
    });
  });

  describe('Personalize Roles', () => {
    const url = `${baseUrl}/example-personalized-roles.html?colors=390567`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should not visually regress on personalize roles', async () => {
      await page.setViewport({ width: 1280, height: 718 });
      await page.waitForSelector('body.no-scroll', { visible: true })
        .then(async () => {
          const image = await page.screenshot();
          const config = getConfig('applicationmenu-personalize-roles');
          expect(image).toMatchImageSnapshot(config);
        });
    });
  });

  describe('Personalize Roles Switcher', () => {
    const url = `${baseUrl}/example-personalized-role-switcher?theme=classic`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should not visually regress on personalize roles switcher', async () => {
      await page.setViewport({ width: 1280, height: 718 });
      await page.waitForSelector('body.no-scroll', { visible: true })
        .then(async () => {
          const image = await page.screenshot();
          const config = getConfig('applicationmenu-personalize-roles-switcher');
          expect(image).toMatchImageSnapshot(config);
        });
    });
  });
});
