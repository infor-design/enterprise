/* eslint-disable compat/compat */
const { dragAndDrop } = require('../../helpers/e2e-utils.cjs');

describe('Application Menu Puppeteer Tests', () => {
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

    it.skip('should resize at middle of the page', async () => {
      const windowSize = await page.viewport();
      const location = [{ y: 0, x: windowSize.width / 2 }];

      await dragAndDrop('.resizer', location);

      // hamburger icon should be visible
      let hamburger = await page.waitForSelector('button#header-hamburger', { visible: true });
      expect(hamburger).toBeTruthy();

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
      expect(hamburger).toBeTruthy();

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
  });

  describe('Menu Button', () => {
    const url = `${baseUrl}/example-menubutton`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should have a working menu button', async () => {
      const menuButton = await page.$('.btn-menu');
      await menuButton.click();

      expect(await page.waitForSelector('#popupmenu-2', { visible: true })).toBeTruthy();
    });
  });

  describe('Open on large', () => {
    const url = `${baseUrl}/example-open-on-large`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should be open on initialization', async () => {
      expect(await page.waitForSelector('#application-menu', { visible: true })).toBeTruthy();
    });
  });

  describe('Truncated text tooltip', () => {
    const url = `${baseUrl}/test-tooltips`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show a tooltip on truncated text', async () => {
      await page.hover('#truncated-text');
      await page.waitForSelector('#tooltip', { visible: true })
        .then(element => element.getProperty('className'))
        .then(className => className.jsonValue())
        .then(classNameString => expect(classNameString).not.toContain('is-hidden'));
    });
  });

  describe('Personalize', () => {
    const url = `${baseUrl}/example-personalized?theme=classic`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the app menu', async () => {
      expect(await page.waitForSelector('#application-menu', { visible: true })).toBeTruthy();
    });
  });

  describe('Personalize Roles', () => {
    const url = `${baseUrl}/example-personalized-roles.html?colors=390567`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the app menu', async () => {
      expect(await page.waitForSelector('#application-menu', { visible: true })).toBeTruthy();
    });
  });

  describe('Role Switcher', () => {
    const url = `${baseUrl}/test-personalized-role-switcher-long-title`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should have a working role switcher with long title', async () => {
      const triggerBtn = await page.waitForSelector('#trigger-btn', { visible: true });
      await triggerBtn.click();

      expect(await page.waitForSelector('.application-menu-switcher-panel', { visible: true })).toBeTruthy();
    });

    it('should assign proper aria roles to the trigger button', async () => {
      await page.evaluate(() => document.getElementById('trigger-btn').getAttribute('aria-controls'))
        .then(ariaControls => expect(ariaControls).toBe('expandable-area-0-content'));

      await page.evaluate(() => document.getElementById('trigger-btn').getAttribute('aria-expanded'))
        .then(ariaExpanded => expect(ariaExpanded).toBe('false'));

      await page.waitForSelector('#trigger-btn', { visible: true })
        .then(el => el.click());

      await page.evaluate(() => document.getElementById('trigger-btn').getAttribute('aria-expanded'))
        .then(ariaExpanded => expect(ariaExpanded).toBe('true'));
    });

    it('should dismiss the role switcher by pressing Escape', async () => {
      await page.waitForSelector('.application-menu-switcher-trigger', { visible: true })
        .then(el => el.click());

      expect(await page.waitForSelector('.application-menu-switcher-panel', { visible: true })).toBeTruthy();

      await page.keyboard.press('Escape');
      expect(await page.waitForSelector('.application-menu-switcher-panel', { hidden: true })).toBeTruthy();
    });
  });

  describe('Custom Search', () => {
    const url = `${baseUrl}/test-filterable-custom`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the search even though filterable is false', async () => {
      expect(await page.waitForSelector('#application-menu-searchfield', { visible: true })).toBeTruthy();
    });

    it('should have a search but not filter the menu when filterable is false', async () => {
      await page.waitForSelector('#application-menu-searchfield', { visible: true });

      await page.type('#application-menu-searchfield', 'Role');

      await page.evaluate(() => document.querySelectorAll('.accordion-header.filtered').length)
        .then(filtered => expect(filtered).toEqual(0));
    });
  });

  describe('Event Propagation', () => {
    const url = `${baseUrl}/test-click-event-propagation`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });

      await page.waitForSelector('#application-menu.is-open', { visible: true });
    });

    it('should fire a toast when its accordion headers are clicked', async () => {
      await page.waitForSelector('#application-menu > div > div:nth-child(3)', { visible: true })
        .then(accordionHeader => accordionHeader.click());

      expect(await page.waitForSelector('#toast-container', { visible: true })).toBeTruthy();
    });
  });

  describe('Personalize Roles Switcher', () => {
    const url = `${baseUrl}/example-personalized-role-switcher?theme=classic`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the app menu', async () => {
      expect(await page.waitForSelector('#application-menu', { visible: true })).toBeTruthy();
    });

    it('should dismiss the application menu when clicking on a popupmenu trigger', async () => {
      // Simulate iPhone X device size.
      // Shrinking the screen causes the menu to be dismissed.
      await page.setViewport({ width: 375, height: 812 });

      await page.waitForSelector('#header-hamburger', { visible: true })
        .then(el => el.click());

      await page.waitForSelector('#header-more-actions', { visible: true })
        .then(el => el.click());

      await page.evaluate(() => document.getElementById('application-menu').getAttribute('class'))
        .then(className => expect(className).not.toContain('is-open'));
    });

    it.skip('should dismiss the application menu when clicking on one of the menus toolbar buttons', async () => {
      await page.setViewport({ width: 375, height: 812 });

      // need a delay for the page to fully visible before clicking the button.
      // lower than 250 milliseconds will cause issue.
      await page.waitForTimeout(250);

      const hamburger = await page.waitForSelector('#header-hamburger', { visible: true });
      await hamburger.click();

      // need another delay to fully show the app menu
      // lower than 150 milliseconds will cause issue.
      await page.waitForTimeout(150);
      await page.evaluate(() => document.getElementById('application-menu').getAttribute('class'))
        .then(el => expect(el).toContain('is-open'));

      const btnToolbar = await page.waitForSelector('button#appmenu-header-toolbar-btn-download', { visible: true });

      // need another delay to fully show the element
      // lower than 100 milliseconds will cause issue.
      await page.waitForTimeout(100);
      await btnToolbar.click();

      await page.evaluate(() => document.getElementById('application-menu').getAttribute('class'))
        .then(className => expect(className).not.toContain('is-open'));
    });
  });

  describe('Manual Init', () => {
    const url = `${baseUrl}/test-manual-init`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should open when the hamburger button is clicked', async () => {
      const menuTrigger = await page.$('.application-menu-trigger');
      await menuTrigger.click();

      // Add delay to fully show the app menu
      await page.waitForTimeout(200);

      expect(await page.waitForSelector('#application-menu', { visible: true })).toBeTruthy();
    });
  });
});
