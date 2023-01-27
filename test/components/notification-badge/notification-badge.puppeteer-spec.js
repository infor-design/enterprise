const { checkDataAutomationId } = require('../../helpers/e2e-utils.js');

describe('Notification-Badge Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/notification-badge';

  describe('Badge Placement Tests', () => {
    const url = `${baseUrl}/example-badge-placement.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
    });

    it('should have six notification badges with different colors on different dot placements', async () => {
      // Alert - Upper left
      await page.evaluate(() => document.querySelector('#notification-badge-1 .notification-dot').getAttribute('class'))
        .then((el) => {
          expect(el).toContain('notification-dot-upper-left');
          expect(el).toContain('notification-dot-alert');
        });

      // Warning - Upper right
      await page.evaluate(() => document.querySelector('#notification-badge-2 .notification-dot').getAttribute('class'))
        .then((el) => {
          expect(el).toContain('notification-dot-upper-right');
          expect(el).toContain('notification-dot-warning');
        });

      // Caution - Lower left
      await page.evaluate(() => document.querySelector('#notification-badge-3 .notification-dot').getAttribute('class'))
        .then((el) => {
          expect(el).toContain('notification-dot-lower-left');
          expect(el).toContain('notification-dot-caution');
        });

      // Complete - Lower right
      await page.evaluate(() => document.querySelector('#notification-badge-4 .notification-dot').getAttribute('class'))
        .then((el) => {
          expect(el).toContain('notification-dot-lower-right');
          expect(el).toContain('notification-dot-complete');
        });

      // Progress - Upper left
      await page.evaluate(() => document.querySelector('#notification-badge-5 .notification-dot').getAttribute('class'))
        .then((el) => {
          expect(el).toContain('notification-dot-upper-left');
          expect(el).toContain('notification-dot-progress');
        });

      // Yield - Upper Right
      await page.evaluate(() => document.querySelector('#notification-badge-6 .notification-dot').getAttribute('class'))
        .then((el) => {
          expect(el).toContain('notification-dot-upper-right');
          expect(el).toContain('notification-dot-yield');
        });
    });

    it('should have the correct sizes', async () => {
      // All Notification dots width should be 6
      const dots = await page.$$('.notification-dot');
      const dotWidths = await Promise.all(dots.map(dot => dot.evaluate(el => el.clientWidth)));
      const hasWidth6 = dotWidths.every(width => width === 6);

      // Notification icon badges width should be 18
      const badgeSizes = await page.$$('.container-spacer svg');
      const badgeWidths = await Promise.all(badgeSizes.map(badgeSize => badgeSize.evaluate(el => el.clientWidth)));
      const hasWidth18 = badgeWidths.every(width => width === 18);

      expect(hasWidth6).toBe(true);
      expect(hasWidth18).toBe(true);
    });

    it('should be able to set id/automation id', async () => {
      const elHandleArray = await page.$$('.container-spacer');

      // Use map to create an array of promises for clicks
      const clickPromises = elHandleArray.map(eL => eL.click());

      // Use map to create an array of promises for data checks
      const checkPromises = elHandleArray.map((eL, i) => Promise.all([checkDataAutomationId(`#notification-badge-id-${i + 1}-container`, `notification-badge-automation-id-${i + 1}-container`), checkDataAutomationId(`#notification-badge-id-${i + 1}-dot`, `notification-badge-automation-id-${i + 1}-dot`)]));

      // Wait for all clicks and data checks to complete
      await Promise.all([...clickPromises, ...checkPromises]);
    });
  });

  describe('Index Tests', () => {
    const url = `${baseUrl}/example-index.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should have six notification badges with different colors', async () => {
      await page.evaluate(() => document.querySelector('#notification-badge-1 > .notification-badge-container span').getAttribute('class'))
        .then(el => expect(el).toContain('notification-dot-upper-right'));
      await page.evaluate(() => document.querySelector('#notification-badge-2 > .notification-badge-container span').getAttribute('class'))
        .then(el => expect(el).toContain('notification-dot-upper-right'));
      await page.evaluate(() => document.querySelector('#notification-badge-3 > .notification-badge-container span').getAttribute('class'))
        .then(el => expect(el).toContain('notification-dot-upper-right'));
      await page.evaluate(() => document.querySelector('#notification-badge-4 > .notification-badge-container span').getAttribute('class'))
        .then(el => expect(el).toContain('notification-dot-upper-right'));
      await page.evaluate(() => document.querySelector('#notification-badge-5 > .notification-badge-container span').getAttribute('class'))
        .then(el => expect(el).toContain('notification-dot-upper-right'));
      await page.evaluate(() => document.querySelector('#notification-badge-6 > .notification-badge-container span').getAttribute('class'))
        .then(el => expect(el).toContain('notification-dot-upper-right'));
    });
  });

  describe('Buttons Tests', () => {
    const url = 'http://localhost:4000/components/button/example-badge.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should have four notification badges with different colors on different dot placements', async () => {
      // Complete
      await page.evaluate(() => document.querySelector('#primary-action-two .notification-dot').getAttribute('class'))
        .then((el) => {
          expect(el).toContain('notification-dot-upper-left');
          expect(el).toContain('notification-dot-complete');
        });

      // Alert
      await page.evaluate(() => document.querySelector('#primary-action-four .notification-dot').getAttribute('class'))
        .then((el) => {
          expect(el).toContain('notification-dot-upper-right');
          expect(el).toContain('notification-dot-alert');
        });

      // Progress
      await page.evaluate(() => document.querySelector('#primary-action-one .notification-dot').getAttribute('class'))
        .then((el) => {
          expect(el).toContain('notification-dot-lower-left');
          expect(el).toContain('notification-dot-progress');
        });

      // Warning
      await page.evaluate(() => document.querySelector('#primary-action-three .notification-dot').getAttribute('class'))
        .then((el) => {
          expect(el).toContain('notification-dot-lower-right');
          expect(el).toContain('notification-dot-warning');
        });
    });
  });

  describe('Appmenu Tests', () => {
    const url = 'http://localhost:4000/components/applicationmenu/example-menu-notification.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should have four notification badges with different colors on different dot placements', async () => {
      // Complete - Upper left
      await page.evaluate(() => document.querySelector('.accordion-header:first-child .notification-dot').getAttribute('class'))
        .then((el) => {
          expect(el).toContain('notification-dot-upper-left');
          expect(el).toContain('notification-dot-complete');
        });

      // Yield - Upper right
      await page.evaluate(() => document.querySelector('.accordion-header:nth-child(2) .notification-dot').getAttribute('class'))
        .then((el) => {
          expect(el).toContain('notification-dot-upper-right');
          expect(el).toContain('notification-dot-yield');
        });

      // Warning - Lower right
      await page.evaluate(() => document.querySelector('.accordion-header:nth-child(3) .notification-dot').getAttribute('class'))
        .then((el) => {
          expect(el).toContain('notification-dot-lower-right');
          expect(el).toContain('notification-dot-warning');
        });

      // Alert - Lower left
      await page.evaluate(() => document.querySelector('.accordion-header:nth-child(4) .notification-dot').getAttribute('class'))
        .then((el) => {
          expect(el).toContain('notification-dot-lower-left');
          expect(el).toContain('notification-dot-alert');
        });
    });
  });

  describe('Enable/Disable Tests', () => {
    const url = `${baseUrl}/example-show-hide.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should be able to enable/disable badge', async () => {
      const disable = await page.$('#disable');
      const enable = await page.$('#enable');
      await disable.click();
      const badge = () => page.evaluate(() => !!document.querySelector('.notification-dot-upper-right.is-disabled'));
      expect(await badge()).toBe(true);
      const isDisabled = await page.$('button[disabled]') !== null;
      expect(isDisabled).toBe(true);
      await enable.click();
      const isEnabled = await page.$('button:not([disabled])') !== null;
      expect(isEnabled).toBe(true);
      expect(await badge()).toBe(false);
    });

    it('should have the correct sizes', async () => {
      const dotSize = await page.evaluate(() => document.querySelector('.notification-dot-upper-right').clientWidth);
      const iconSize = await page.evaluate(() => document.querySelector('#notification-badge-1 > svg').clientWidth);

      expect(dotSize).toBe(6);
      expect(iconSize).toBe(18);
    });
  });
});
