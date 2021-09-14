const { getWidthandCompare, getIDandCompare, compareInnerHTML } = require('../../helpers/e2e-utils.js');

describe('notification-badge Puppeteer Tests', () => {
  describe('Badge Placement Tests', () => {
    const url = 'http://localhost:4000/components/notification-badge/example-badge-placement.html?theme=classic&mode=light&layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it(' should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it(' should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
    });

    it(' should have six notification badges with different colors on different dot placements', async () => {
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

    it(' should have Icons 18x18 pixels, and the dot should be 6x6', async () => {
      let hasFailed = false;
      const checkElementsSize = async (el, size) => {
        const elHandleArray = await page.$$('.container-spacer');
        let index = 0;
        // eslint-disable-next-line no-restricted-syntax
        for await (const eL of elHandleArray) {
          await eL.click();
          try {
            switch (index) {
              case 0:
                await getWidthandCompare(`#notification-badge-id-${index + 1}-${el}`, size);
                break;
              case 1:
                await getWidthandCompare(`#notification-badge-id-${index + 1}-${el}`, size);
                break;
              case 2:
                await getWidthandCompare(`#notification-badge-id-${index + 1}-${el}`, size);
                break;
              case 3:
                await getWidthandCompare(`#notification-badge-id-${index + 1}-${el}`, size);
                break;
              case 4:
                await getWidthandCompare(`#notification-badge-id-${index + 1}-${el}`, size);
                break;
              case 5:
                await getWidthandCompare(`#notification-badge-id-${index + 1}-${el}`, size);
                break;
              default:

                hasFailed = true;
            }
          } catch (err) {
            hasFailed = true;
          }
          index += 1;
        }
        return hasFailed;
      };
      await checkElementsSize('icon', '18px');
      await checkElementsSize('dot', '6px');
      expect(hasFailed).toBe(false);
    });

    it(' should be able to set id/automation id', async () => {
      const isFailed = [];
      isFailed.push(await getIDandCompare('#notification-badge-id-1-icon', 'notification-badge-automation-id-1-icon'));
      isFailed.push(await getIDandCompare('#notification-badge-id-2-icon', 'notification-badge-automation-id-2-icon'));
      isFailed.push(await getIDandCompare('#notification-badge-id-3-icon', 'notification-badge-automation-id-3-icon'));
      isFailed.push(await getIDandCompare('#notification-badge-id-4-icon', 'notification-badge-automation-id-4-icon'));
      isFailed.push(await getIDandCompare('#notification-badge-id-5-icon', 'notification-badge-automation-id-5-icon'));
      isFailed.push(await getIDandCompare('#notification-badge-id-6-icon', 'notification-badge-automation-id-6-icon'));
      isFailed.push(await getIDandCompare('#notification-badge-id-1-dot', 'notification-badge-automation-id-1-dot'));
      isFailed.push(await getIDandCompare('#notification-badge-id-2-dot', 'notification-badge-automation-id-2-dot'));
      isFailed.push(await getIDandCompare('#notification-badge-id-3-dot', 'notification-badge-automation-id-3-dot'));
      isFailed.push(await getIDandCompare('#notification-badge-id-4-dot', 'notification-badge-automation-id-4-dot'));
      isFailed.push(await getIDandCompare('#notification-badge-id-5-dot', 'notification-badge-automation-id-5-dot'));
      isFailed.push(await getIDandCompare('#notification-badge-id-6-dot', 'notification-badge-automation-id-6-dot'));
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Index Tests', () => {
    const url = 'http://localhost:4000/components/notification-badge/example-index.html?theme=classic&mode=light&layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it(' should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it(' should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
    });

    it(' should have six notification badges with different colors on different dot placements', async () => {
      const elHandleArray = await page.$$('.container-spacer');
      const isFailed = [];
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        await eL.click();
        isFailed.push(await compareInnerHTML(`#notification-badge-${index + 1} > .notification-badge-container`, 'notification-dot-upper-right'));
        isFailed.push(await compareInnerHTML(`#notification-badge-${index + 1} > .notification-badge-container`, 'notification-dot-upper-right'));
        isFailed.push(await compareInnerHTML(`#notification-badge-${index + 1} > .notification-badge-container`, 'notification-dot-upper-right'));
        isFailed.push(await compareInnerHTML(`#notification-badge-${index + 1} > .notification-badge-container`, 'notification-dot-upper-right'));
        isFailed.push(await compareInnerHTML(`#notification-badge-${index + 1} > .notification-badge-container`, 'notification-dot-upper-right'));
        isFailed.push(await compareInnerHTML(`#notification-badge-${index + 1} > .notification-badge-container`, 'notification-dot-upper-right'));
        index += 1;
      }
      expect(isFailed).not.toContain(true);
    });
  });
});
