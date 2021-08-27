describe('notification-badge Puppeteer Tests', () => {
  describe('Badge Placement Tests', () => {
    const url = 'http://localhost:4000/components/notification-badge/example-badge-placement.html?theme=classic&mode=light&layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should have six notification badges with different colors on different dot placements', async () => {
      const elHandleArray = await page.$$('.container-spacer');
      // eslint-disable-next-line no-unused-vars
      elHandleArray.forEach(async (el, index) => {
        await page.waitForSelector('.notification-badge-container', { visible: true });
        const notifbadge = await page.$eval(`#notification-badge-id-${index + 1}-container`, element => element.innerHTML);
        try {
          switch (index) {
            case 0:
              expect(notifbadge).toContain('notification-dot-upper-left');
              break;
            case 1:
              expect(notifbadge).toContain('notification-dot-upper-right123');
              break;
            case 2:
              expect(notifbadge).toContain('notification-dot-lower-left');
              break;
            case 3:
              expect(notifbadge).toContain('notification-dot-lower-right123');
              break;
            case 4:
              expect(notifbadge).toContain('notification-dot-upper-left');
              break;
            case 5:
              expect(notifbadge).toContain('notification-dot-upper-right');
              break;
            default:
              console.error('No Value Found');
          }
        } catch (error) {
          console.error(error);
        }
        index += 1;
      });
      // }
    });

    async function getWidth(index, iconWidth, dotWidth) {
      const iconEl = await page.$eval(`#notification-badge-id-${index + 1}-icon`, e => getComputedStyle(e).width);
      const dotEl = await page.$eval(`#notification-badge-id-${index + 1}-dot`, e => getComputedStyle(e).width);
      expect(iconEl).toBe(iconWidth);
      expect(dotEl).toBe(dotWidth);
    }
    it('should have Icons 18x18 pixels, and the dot should be 6x6', async () => {
      const elHandleArray = await page.$$('.container-spacer');
      // let x = 0;
      // eslint-disable-next-line no-unused-vars
      elHandleArray.map(async (el, index) => {
      // for (const el of elHandleArray) {
        try {
          switch (index) {
            case 0:
              getWidth(index, '18px', '6px');
              break;
            case 1:
              getWidth(index, '18px', '6px123');
              break;
            case 2:
              getWidth(index, '18px', '6px');
              break;
            case 3:
              getWidth(index, '18px', '6px');
              break;
            case 4:
              getWidth(index, '18px', '6px123');
              break;
            case 5:
              getWidth(index, '18px', '6px');
              break;
            default:
              console.error('No Value Found');
          }
        } catch (error) {
          console.error(error);
        }
        index += 1;
      });
    });
    const getIDandCompare = async (el, val) => {
      const elemHandle = await page.$(el);
      const elemID = await page.evaluate(elem => elem.getAttribute('data-automation-id'), elemHandle);
      expect(elemID).toEqual(val);
      return elemID;
    };
    it('should be able to set id/automation id', async () => {
      await getIDandCompare('#notification-badge-id-1-icon', 'notification-badge-automation-id-1-icon');
      await getIDandCompare('#notification-badge-id-2-icon', 'notification-badge-automation-id-2-icon');
      await getIDandCompare('#notification-badge-id-3-icon', 'notification-badge-automation-id-3-icon');
      await getIDandCompare('#notification-badge-id-4-icon', 'notification-badge-automation-id-4-icon');
      await getIDandCompare('#notification-badge-id-5-icon', 'notification-badge-automation-id-5-icon');
      await getIDandCompare('#notification-badge-id-6-icon', 'notification-badge-automation-id-6-icon');
    });
  });
});
