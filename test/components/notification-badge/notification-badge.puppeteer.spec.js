describe('notification-badge Puppeteer Tests', () => {
  describe('Badge Placement Tests', () => {
    const url = 'http://localhost:4000/components/notification-badge/example-badge-placement.html?theme=classic&mode=light&layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it(' should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
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
          // });
        }
        return hasFailed;
      };

      expect(await checkBadgePlacement()).not.toBeTruthy();
      // }
    });
    async function getWidth(index, el, width) {
      const elem = await page.$eval(`#notification-badge-id-${index + 1}-${el}`, e => getComputedStyle(e).width);
      expect(elem).toBe(width);
    }
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
                await getWidth(index, el, size);
                break;
              case 1:
                await getWidth(index, el, size);
                break;
              case 2:
                await getWidth(index, el, size);
                break;
              case 3:
                await getWidth(index, el, size);
                break;
              case 4:
                await getWidth(index, el, size);
                break;
              case 5:
                await getWidth(index, el, size);
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
      let isFailed = false;
      const getIDandCompare = async (el, val) => {
        try {
          const elemHandle = await page.$(el);
          const elemID = await page.evaluate(elem => elem.getAttribute('data-automation-id'), elemHandle);
          expect(elemID).toEqual(val);
        } catch (error) {
          isFailed = true;
        }
      };
      await getIDandCompare('#notification-badge-id-1-icon', 'notification-badge-automation-id-1-icon');
      await getIDandCompare('#notification-badge-id-2-icon', 'notification-badge-automation-id-2-icon');
      await getIDandCompare('#notification-badge-id-3-icon', 'notification-badge-automation-id-3-icon');
      await getIDandCompare('#notification-badge-id-4-icon', 'notification-badge-automation-id-4-icon');
      await getIDandCompare('#notification-badge-id-5-icon', 'notification-badge-automation-id-5-icon');
      await getIDandCompare('#notification-badge-id-6-icon', 'notification-badge-automation-id-6-icon');
      expect(isFailed).toBe(false);
    });
  });
});
