const { getComputedStyle, checkDataAutomationID, checkInnerHTMLValue } = require('../../helpers/e2e-utils.js');

describe('Notification-Badge Puppeteer Tests', () => {
  describe('Badge Placement Tests', () => {
    const url = 'http://localhost:4000/components/notification-badge/example-badge-placement.html?theme=classic&mode=light&layout=nofrills';
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

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea).toMatchObject({
        name: 'IDS Enterprise',
        role: 'RootWebArea',
      });
    });

    it('should have six notification badges with different colors on different dot placements', async () => {
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

    it('should have Icons 22x22 pixels, and the dot should be 6x6', async () => {
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
      await checkiconSize('width', '22px');
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
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
    });

    it('should have Accessibility', async () => {
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

  describe('Buttons Tests', () => {
    /*
    |-------------------------------------------------------|
    | https://github.com/infor-design/enterprise/pull/5790  |
    |-------------------------------------------------------| */
    const url = 'http://localhost:4000/components/button/example-badge.html';
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

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea).toMatchInlineSnapshot(`
Object {
  "children": Array [
    Object {
      "name": "Skip to Main Content",
      "role": "link",
    },
    Object {
      "level": 1,
      "name": "IDS Enterprise",
      "role": "heading",
    },
    Object {
      "haspopup": "menu",
      "name": "Header More Actions Button",
      "role": "combobox",
    },
    Object {
      "name": "Icon",
      "role": "StaticText",
    },
    Object {
      "name": "Date",
      "role": "button",
    },
    Object {
      "name": "Date",
      "role": "button",
    },
    Object {
      "name": "Date",
      "role": "button",
    },
    Object {
      "name": "Date",
      "role": "button",
    },
  ],
  "name": "IDS Enterprise",
  "role": "RootWebArea",
}
`);
    });

    it('should have four notification badges with different colors on different dot placements', async () => {
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

    it('should have Icons 22x22 pixels, and the dot should be 6x6', async () => {
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
      await checkiconSize('width', '22px');
      await checkdotSize('dot', 'width', '6px');
      expect(hasFailed).toBe(false);
    });
  });

  describe('Appmenu Tests', () => {
    /*
    |-------------------------------------------------------|
    | https://github.com/infor-design/enterprise/pull/5790  |
    |-------------------------------------------------------| */
    const url = 'http://localhost:4000/components/applicationmenu/example-menu-notification.html';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport', 'aria-required-attr', 'color-contrast', 'aria-required-parent', 'nested-interactive'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea).toMatchInlineSnapshot(`
Object {
  "children": Array [
    Object {
      "name": "Skip to Main Content",
      "role": "link",
    },
    Object {
      "name": "Photo of Richard Fairbanks",
      "role": "img",
    },
    Object {
      "name": "Employee",
      "role": "button",
    },
    Object {
      "name": "Richard",
      "role": "StaticText",
    },
    Object {
      "name": "Fairbanks",
      "role": "StaticText",
    },
    Object {
      "name": "Download",
      "role": "button",
    },
    Object {
      "name": "Print",
      "role": "button",
    },
    Object {
      "name": "Purchasing",
      "role": "button",
    },
    Object {
      "name": "Notification",
      "role": "button",
    },
    Object {
      "name": "Inventory",
      "role": "button",
    },
    Object {
      "name": "Search",
      "role": "StaticText",
    },
    Object {
      "haspopup": "listbox",
      "name": "Look up menu items",
      "role": "combobox",
    },
    Object {
      "name": "Home",
      "role": "link",
    },
    Object {
      "name": "Profile",
      "role": "link",
    },
    Object {
      "name": "Pay",
      "role": "link",
    },
    Object {
      "name": "Time Off",
      "role": "link",
    },
    Object {
      "name": "Settings",
      "role": "button",
    },
    Object {
      "name": "Proxy as user",
      "role": "button",
    },
    Object {
      "name": "About this App",
      "role": "button",
    },
    Object {
      "name": "Log Out",
      "role": "button",
    },
    Object {
      "expanded": true,
      "name": "Application Menu Trigger",
      "role": "button",
    },
    Object {
      "level": 1,
      "name": "User Profile",
      "role": "heading",
    },
    Object {
      "name": "Update Details",
      "role": "button",
    },
    Object {
      "haspopup": "menu",
      "name": "Header More Actions Button",
      "role": "combobox",
    },
    Object {
      "children": Array [
        Object {
          "name": "Dates of Service",
          "role": "tab",
          "selected": true,
        },
      ],
      "name": "Dates of Service",
      "role": "tab",
    },
    Object {
      "children": Array [
        Object {
          "name": "Personal Information",
          "role": "tab",
        },
      ],
      "name": "Personal Information",
      "role": "tab",
    },
    Object {
      "children": Array [
        Object {
          "name": "My Password",
          "role": "tab",
        },
      ],
      "name": "My Password",
      "role": "tab",
    },
    Object {
      "name": "Man bun portland venmo, reprehenderit cillum exercitation culpa adaptogen pitchfork unicorn. Jianbing mlkshk cloud bread id. Qui forage twee meditation hammock commodo heirloom gochujang shaman tattooed. Ethical commodo woke, ea est in artisan farm-to-table asymmetrical four loko ut cleanse thundercats. Gochujang reprehenderit schlitz cred squid tote bag tempor literally consequat exercitation.",
      "role": "StaticText",
    },
  ],
  "name": "IDS Enterprise",
  "role": "RootWebArea",
}
`);
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

            /*           try {
            if (index === 0) {
              const notifbadge = await page.$eval(`#primary-action-${count} > span.notification-badge-container`, element => element.innerHTML);
              expect(notifbadge).toContain('notification-dot-lower-left');
            }

            if (index === 1) {
              const notifbadge = await page.$eval(`#primary-action-${count} > span.notification-badge-container`, element => element.innerHTML);
              expect(notifbadge).toContain('notification-dot-upper-left');
            }

            if (index === 2) {
              const notifbadge = await page.$eval(`#primary-action-${count} > span.notification-badge-container`, element => element.innerHTML);
              expect(notifbadge).toContain('notification-dot-lower-right');
            }

            if (index === 3) {
              const notifbadge = await page.$eval(`#primary-action-${count} > span.notification-badge-container`, element => element.innerHTML);
              expect(notifbadge).toContain('notification-dot-upper-right');
            }
          }  */
          } catch (error) {
            hasFailed = true;
          }
          index += 1;
        }
        return hasFailed;
      };
      expect(await checkBadgePlacement()).not.toBeTruthy();
    });

    it('should have Icons 18x18 pixels, and the dot should be 6x6', async () => {
      let hasFailed = false;
      const checkdotSize = async (style, value) => {
        const elHandleArray = await page.$$('.notification-badge-container');
        let index = 0;
        // eslint-disable-next-line no-restricted-syntax
        for await (const eL of elHandleArray) {
          await eL.click();
          try {
            const width = await getComputedStyle(`div:nth-child(${index + 1}) > span > span`, style);
            expect(width).toBe(value);
          } catch (err) {
            hasFailed = true;
          }
          index += 1;
        }
        return hasFailed;
      };

      const checkiconSize = async (style, value) => {
        const elHandleArray = await page.$$('.notification-badge-container');
        let index = 0;
        // eslint-disable-next-line no-restricted-syntax
        for await (const eL of elHandleArray) {
          await eL.click();
          try {
            const width = await getComputedStyle(`div:nth-child(${index + 1}) > span > svg`, style);
            expect(width).toBe(value);
          } catch (err) {
            hasFailed = true;
          }
          index += 1;
        }
        return hasFailed;
      };
      await checkiconSize('width', '18px');
      await checkdotSize('width', '6px');
      expect(hasFailed).toBe(false);
    });
  });

  describe('Enable/Disable Tests', () => {
    /*
    |-------------------------------------------------------|
    | https://github.com/infor-design/enterprise/pull/5790  |
    |-------------------------------------------------------| */
    const url = 'http://localhost:4000/components/notification-badge/example-enable-disable.html';
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

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea).toMatchInlineSnapshot(`
Object {
  "children": Array [
    Object {
      "name": "Skip to Main Content",
      "role": "link",
    },
    Object {
      "level": 1,
      "name": "IDS Enterprise",
      "role": "heading",
    },
    Object {
      "haspopup": "menu",
      "name": "Header More Actions Button",
      "role": "combobox",
    },
    Object {
      "name": "Enable & Disable Badge",
      "role": "StaticText",
    },
    Object {
      "name": "Disable Badge",
      "role": "button",
    },
    Object {
      "disabled": true,
      "name": "Enable Badge",
      "role": "button",
    },
  ],
  "name": "IDS Enterprise",
  "role": "RootWebArea",
}
`);
    });

    it('should be able to enable/disable badge', async () => {
      const disable = await page.$('#disable');
      const enable = await page.$('#enable');
      await disable.click();
      const badge = () => page.evaluate(() => !!document.querySelector('.notification-dot-upper-right.is-disabled'));
      expect(await badge()).toBe(true);
      const isDisabled = await page.$eval('div[disabled]', e => e !== null);
      expect(isDisabled).toBe(true);
      await enable.click();
      const isEnabled = await page.$('div:not([disabled])') !== null;
      expect(isEnabled).toBe(true);
      expect(await badge()).toBe(false);
    });

    it('should have Icons 18x18 pixels, and the dot should be 6x6', async () => {
      const dotSize = await getComputedStyle('.notification-dot-upper-right', 'width');
      const iconSize = await getComputedStyle('#notification-badge-1 > svg', 'width');

      expect(dotSize).toBe('6px');
      expect(iconSize).toBe('18px');
    });
  });
});
