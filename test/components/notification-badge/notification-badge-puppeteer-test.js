
const { AxePuppeteer } = require('@axe-core/puppeteer');

const { getComputedStyle, checkDataAutomationID, checkInnerHTMLValue } = require('../../helpers/e2e-utils.cjs');

describe('Notification-Badge Puppeteer Tests', () => {
  describe('Badge Placement Tests', () => {
    const url = 'http://localhost:4000/components/notification-badge/example-badge-placement.html?theme=new&mode=light&layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      const results = await new AxePuppeteer(page).disableRules(['meta-viewport']).analyze();
      expect(results.violations.length).toBe(0);
    });

    it('should pass accessibility checks', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea).toMatchObject({
        name: 'IDS Enterprise',
        role: 'RootWebArea',
      });
    });

    // improve and simplify this test
    it.skip('should have six notification badges with different colors on different dot placements', async () => {
      let hasFailed = false;
      const checkBadgePlacement = async () => {
        const elHandleArray = await page.$$('.container-spacer');
        let index = 0;
        // eslint-disable-next-line no-restricted-syntax
        for await (const eL of elHandleArray) {
          await eL.click();
          await page.waitForSelector('.notification-badge-container', { visible: true });
          const notifbadge = await page.$eval(`#notification-badge-id-${index + 1}-container`, element => element.innerHTML);
          try {
            switch (index) {
              case 0:
                expect(notifbadge).toContain('notification-dot-upper-left');
                break;
              case 1:
                expect(notifbadge).toContain('notification-dot-upper-right');
                break;
              case 2:
                expect(notifbadge).toContain('notification-dot-lower-left');
                break;
              case 3:
                expect(notifbadge).toContain('notification-dot-lower-right');
                break;
              case 4:
                expect(notifbadge).toContain('notification-dot-upper-left');
                break;
              case 5:
                expect(notifbadge).toContain('notification-dot-upper-right');
                break;
              default:
                hasFailed = true;
            }
          } catch (error) {
            hasFailed = true;
          }
          index += 1;
        }
        return hasFailed;
      };
      expect(await checkBadgePlacement()).not.toBeTruthy();
    });

    it('should have the correct sizes', async () => {
      let hasFailed = false;
      const checkdotSize = async (element, style, value) => {
        const elHandleArray = await page.$$('.container-spacer');
        let index = 0;
        // eslint-disable-next-line no-restricted-syntax
        for await (const eL of elHandleArray) {
          await eL.click();
          try {
            const width = await getComputedStyle(`#notification-badge-id-${index + 1}-${element}`, style);
            expect(width).toBe(value);
          } catch (err) {
            hasFailed = true;
          }
          index += 1;
        }
        return hasFailed;
      };

      const checkiconSize = async (style, value) => {
        const elHandleArray = await page.$$('.container-spacer');
        let index = 0;
        // eslint-disable-next-line no-restricted-syntax
        for await (const eL of elHandleArray) {
          await eL.click();
          try {
            const width = await getComputedStyle(`#notification-badge-${index + 1} > svg`, style);
            expect(width).toBe(value);
          } catch (err) {
            hasFailed = true;
          }
          index += 1;
        }
        return hasFailed;
      };
      await checkiconSize('width', '18px');
      await checkdotSize('dot', 'width', '6px');
      expect(hasFailed).toBe(false);
    });

    it('should be able to set id/automation id', async () => {
      const isFailed = [];
      let index = 0;
      const elHandleArray = await page.$$('.container-spacer');
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        await eL.click();
        isFailed.push(await checkDataAutomationID(`#notification-badge-id-${index + 1}-container`, `notification-badge-automation-id-${index + 1}-container`));
        isFailed.push(await checkDataAutomationID(`#notification-badge-id-${index + 1}-dot`, `notification-badge-automation-id-${index + 1}-dot`));
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Index Tests', () => {
    const url = 'http://localhost:4000/components/notification-badge/example-index.html';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      const results = await new AxePuppeteer(page).disableRules(['meta-viewport']).analyze();
      expect(results.violations.length).toBe(0);
    });

    it('should pass accessibility checks', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea).toMatchObject({
        name: 'IDS Enterprise',
        role: 'RootWebArea',
      });
      expect(webArea.children[0]).toMatchObject({
        name: 'Skip to Main Content',
        role: 'link'
      });
      expect(webArea.children[1]).toMatchObject({
        role: 'heading',
        name: 'IDS Enterprise',
        level: 1
      });
      expect(webArea.children[2]).toMatchObject({
        role: 'combobox',
        name: 'Header More Actions Button',
        haspopup: 'menu'
      });
      expect(webArea.children[3]).toMatchObject({
        role: 'StaticText',
        name: 'Notification Badge'
      });
    });

    it('should have six notification badges with different colors', async () => {
      const isFailed = [];
      isFailed.push(await checkInnerHTMLValue('#notification-badge-1 > .notification-badge-container', 'notification-dot-upper-right'));
      isFailed.push(await checkInnerHTMLValue('#notification-badge-2 > .notification-badge-container', 'notification-dot-upper-right'));
      isFailed.push(await checkInnerHTMLValue('#notification-badge-3 > .notification-badge-container', 'notification-dot-upper-right'));
      isFailed.push(await checkInnerHTMLValue('#notification-badge-4 > .notification-badge-container', 'notification-dot-upper-right'));
      isFailed.push(await checkInnerHTMLValue('#notification-badge-5 > .notification-badge-container', 'notification-dot-upper-right'));
      isFailed.push(await checkInnerHTMLValue('#notification-badge-6 > .notification-badge-container', 'notification-dot-upper-right'));
      expect(isFailed).not.toContain(true);
    });
  });

  describe.skip('Buttons Tests', () => {
    const url = 'http://localhost:4000/components/button/example-badge.html';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    // Improve this test
    it.skip('should have four notification badges with different colors on different dot placements', async () => {
      let hasFailed = false;
      const checkBadgePlacement = async () => {
        const elHandleArray = await page.$$('.notification-badge-container');
        let index = 0;
        let count = '';
        // eslint-disable-next-line no-restricted-syntax
        for await (const eL of elHandleArray) {
          await eL.focus();
          await page.waitForSelector('.notification-badge-container', { visible: true });
          try {
            if (index === 0) {
              count = 'one';
              const notifbadge = await page.$eval(`#primary-action-${count} > span.notification-badge-container`, element => element.innerHTML);
              expect(notifbadge).toContain('notification-dot-lower-left');
            }

            if (index === 1) {
              count = 'two';
              const notifbadge = await page.$eval(`#primary-action-${count} > span.notification-badge-container`, element => element.innerHTML);
              expect(notifbadge).toContain('notification-dot-upper-left');
            }

            if (index === 2) {
              count = 'three';
              const notifbadge = await page.$eval(`#primary-action-${count} > span.notification-badge-container`, element => element.innerHTML);
              expect(notifbadge).toContain('notification-dot-lower-right');
            }

            if (index === 3) {
              count = 'four';
              const notifbadge = await page.$eval(`#primary-action-${count} > span.notification-badge-container`, element => element.innerHTML);
              expect(notifbadge).toContain('notification-dot-upper-right');
            }
          } catch (error) {
            hasFailed = true;
          }
          index += 1;
        }
        return hasFailed;
      };
      expect(await checkBadgePlacement()).not.toBeTruthy();
    });
  });

  describe('Appmenu Tests', () => {
    const url = 'http://localhost:4000/components/applicationmenu/example-menu-notification.html';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should have four notification badges with different colors on different dot placements', async () => {
      let hasFailed = false;
      const checkBadgePlacement = async () => {
        const elHandleArray = await page.$$('.notification-badge-container');
        let index = 0;
        // eslint-disable-next-line no-restricted-syntax
        for await (const eL of elHandleArray) {
          await eL.focus();
          await page.waitForSelector('.notification-badge-container', { visible: true });
          const notifbadge = await page.$eval(`div.accordion.panel.inverse.has-icons > div:nth-child(${index + 1}) > span`, element => element.innerHTML);
          try {
            switch (index) {
              case 0:
                expect(notifbadge).toContain('notification-dot-upper-left');
                break;
              case 1:
                expect(notifbadge).toContain('notification-dot-upper-right');
                break;
              case 2:
                expect(notifbadge).toContain('notification-dot-lower-right');
                break;
              case 3:
                expect(notifbadge).toContain('notification-dot-lower-left');
                break;
              default:
                hasFailed = true;
            }
          } catch (error) {
            hasFailed = true;
          }
          index += 1;
        }
        return hasFailed;
      };
      expect(await checkBadgePlacement()).not.toBeTruthy();
    });
  });

  describe('Enable/Disable Tests', () => {
    const url = 'http://localhost:4000/components/notification-badge/example-show-hide.html';
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
      const dotSize = await getComputedStyle('.notification-dot-upper-right', 'width');
      const iconSize = await getComputedStyle('#notification-badge-1 > svg', 'width');

      expect(dotSize).toBe('6px');
      expect(iconSize).toBe('18px');
    });
  });
});
