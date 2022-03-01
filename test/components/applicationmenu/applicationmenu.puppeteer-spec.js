/* eslint-disable compat/compat */
const { dragAndDrop } = require('../../helpers/e2e-utils');
const { getConfig } = require('../../helpers/e2e-utils.js');

describe('Application Menu Puppeteer Test', () => {
  const baseUrl = 'http://localhost:4000/components/applicationmenu';

  describe('Index', () => {
    const url = `${baseUrl}/example-index?theme=classic`;

    beforeEach(async () => {
      await page.goto(url, { waitUnitl: ['domcontentloaded', 'networkidle2'] });
    });

    it('should open when the hamburger button is clicked', async () => {
      const button = await page.waitForSelector('.application-menu-trigger', { visible: true });
      await button.click();
      await page.waitForSelector('#application-menu', { visible: true })
        .then(element => element.getProperty('className'))
        .then(className => className.jsonValue())
        .then(classNameString => expect(classNameString).toContain('is-open'));
    });

    it('should put accurate aria attributes on the trigger button', async () => {
      await page.evaluate(() => document.getElementById('header-hamburger').getAttribute('aria-controls'))
        .then(ariaControls => expect(ariaControls).toBe('application-menu'));

      await page.evaluate(() => document.getElementById('header-hamburger').getAttribute('aria-expanded'))
        .then(ariaExpanded => expect(ariaExpanded).toBe('false'));

      const headerHamburger = await page.waitForSelector('#header-hamburger', { visible: true });
      await headerHamburger.click();

      await page.evaluate(() => document.getElementById('header-hamburger').getAttribute('aria-expanded'))
        .then(ariaExpanded => expect(ariaExpanded).toBe('true'));
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

    it('should filter', async () => {
      await page.type('#appmenu-searchfield', 'Role');
      await page.waitForSelector('.has-filtered-children', { visible: true })
        .then(async () => {
          await page.evaluate(() => document.querySelectorAll('.accordion-header.filtered').length)
            .then(filteredEl => expect(filteredEl).toEqual(8));

          await page.evaluate(() => document.querySelectorAll('.accordion-header').length)
            .then(filteredEl => expect(filteredEl).toEqual(19));
        });
    });

    it('should not visually regress when filtered', async () => {
      await page.setViewport({ width: 1280, height: 718 });
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

  describe('Menu Button', () => {
    const url = `${baseUrl}/example-menubutton`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should have a working menu button', async () => {
      const menuButton = await page.waitForSelector('.btn-menu', { visible: true });
      await menuButton.click();

      expect(await page.waitForSelector('#popupmenu-2', { visible: true })).toBeTruthy();
    });
  });

  describe('App Menu open on large', () => {
    const url = `${baseUrl}/example-open-on-large`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should be open on initialization', async () => {
      expect(await page.waitForSelector('#application-menu', { visible: true })).toBeTruthy();
    });
  });

  describe('App Menu container', () => {
    const url = `${baseUrl}/test-container`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it.only('should display without visual bugs', async () => {
      const button = await page.waitForSelector('.application-menu-trigger', { visible: true });
      await button.click();

      expect(await page.waitForSelector('#application-menu', { visible: true })).toBeTruthy();
      await page.evaluate(() => document.querySelectorAll('.accordion-header').length)
        .then(accordionHeader => expect(accordionHeader).toEqual(17));
      expect(await page.waitForSelector('.accordion-header', { visible: true })).toBeTruthy();
    });
  });

  describe('Resize', () => {
    const url = `${baseUrl}/example-resizable-menu`;

    /**
     * Check if application menu is visible
     * @param {string} selector selector of app menu
     * @param {boolean} isVisible if app menu should be visible or not
     */
    function checkVisibility(selector, isVisible) {
      return page.waitForSelector(selector, { visible: isVisible, hidden: !isVisible })
        .then(element => Promise.all([element, element.evaluate(dom => getComputedStyle(dom).getPropertyValue('display'))]))
        .then((output) => {
          if (isVisible) {
            expect(output[1]).not.toEqual('none');
          } else {
            expect(output[1]).toEqual('none');
          }
          return output[0];
        });
    }

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should resize at middle of the page', async () => {
      const windowSize = await page.viewport();
      const location = [{ y: 0, x: windowSize.width / 2 }];

      await dragAndDrop('.resizer', location);

      // hamburger icon should be visible
      let hamburger = await page.waitForSelector('button#header-hamburger', { visible: true });
      expect(hamburger).toBeDefined();

      // Menu size after being dragged
      const menuSize = await checkVisibility('nav#application-menu', true).then(element => element.boundingBox());

      hamburger = await page.waitForSelector('button#header-hamburger', { visible: true });
      await hamburger.click();

      await checkVisibility('nav#application-menu', false);

      hamburger = await page.waitForSelector('button#header-hamburger', { visible: true });
      await hamburger.click();

      await checkVisibility('nav#application-menu', true)
        .then(element => element.boundingBox())
        .then(boundingBox => expect(boundingBox.width).toEqual(menuSize.width));
    });

    it.skip('should resize at the near end of the page', async () => {
      const windowSize = await page.viewport();
      const location = [{ y: 0, x: windowSize.width - (windowSize.width * 0.1) }];

      await dragAndDrop('.resizer', location);

      // hamburger icon should be visible
      let hamburger = await page.waitForSelector('button#header-hamburger', { visible: true });
      expect(hamburger).toBeDefined();

      // Menu size after being dragged
      const menuSize = await checkVisibility('nav#application-menu', true).then(element => element.boundingBox());

      hamburger = await page.waitForSelector('button#header-hamburger', { visible: true });
      await hamburger.click();

      await checkVisibility('nav#application-menu', false);

      hamburger = await page.waitForSelector('button#header-hamburger', { visible: true });
      await hamburger.click();

      await checkVisibility('nav#application-menu', true)
        .then(element => element.boundingBox())
        .then(boundingBox => expect(boundingBox.width).toEqual(menuSize.width));
    });

    it.skip('should save last resize', async () => {
      const windowSize = await page.viewport();
      const location = [{ y: 0, x: windowSize.width - (windowSize.width * 0.1) }];

      await dragAndDrop('.resizer', location);

      const menuSize = await checkVisibility('nav#application-menu', true).then(element => element.boundingBox());

      let hamburger = await page.waitForSelector('button#header-hamburger', { visible: true });
      await hamburger.click();

      await checkVisibility('nav#application-menu', false);

      hamburger = await page.waitForSelector('button#header-hamburger', { visible: true });
      await hamburger.click();

      await checkVisibility('nav#application-menu', true)
        .then(element => element.boundingBox())
        .then(boundingBox => expect(boundingBox.width).toEqual(menuSize.width));

      // refresh page
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });

      await checkVisibility('nav#application-menu', true)
        .then(element => element.boundingBox())
        .then(boundingBox => expect(boundingBox.width).toEqual(menuSize.width));
    });
  });
});
