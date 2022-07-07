/* eslint-disable compat/compat */
describe('Button Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/button';

  describe('Index tests', () => {
    const url = `${baseUrl}/example-index`;
    const tabKey = (times) => {
      const promises = [];

      for (let i = 0; i < times; i++) {
        promises.push(page.keyboard.press('Tab'));
      }

      return Promise.all(promises);
    };

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be disabled', async () => {
      await page.$eval('#primary-action-three', el => [el.getAttribute('class'), el.disabled])
        .then((attr) => {
          expect(attr[0]).not.toContain('is-disabled');
          expect(attr[1]).toBeTruthy();
        });
    });

    it('should tab to "Primary Button", and animate on enter', async () => {
      await tabKey(3);
      await page.keyboard.press('Enter');

      await page.$eval('.btn-primary svg', el => el.getAttribute('class')).then(attr => expect(attr).toContain('ripple-effect'));
    });

    it('should click on "Primary Button", and animate on click', async () => {
      const buttonEl = await page.$('.btn-primary');
      await buttonEl.click().then(() => buttonEl.$eval('svg', el => el.getAttribute('class')).then(attr => expect(attr).toContain('ripple-effect')));
    });

    it('should click on "Disabled Primary Button", and not animate', async () => {
      await page.$$('.btn-primary').then(async (elArr) => {
        await elArr[1].click();
        expect(await elArr[1].evaluate(e => e.disabled)).toBeTruthy();
        expect((await elArr[1].$$('svg.ripple-effect')).length).toBe(0);
      });
    });

    it('should tab to "Secondary Button", and animate on enter', async () => {
      await page.focus('.btn-primary');
      await tabKey(2);
      await page.keyboard.press('Enter');
      await page.$eval('.btn-secondary svg', el => el.getAttribute('class')).then(attr => expect(attr).toContain('ripple-effect'));
    });

    it('should click on "Secondary Button", and animate on click', async () => {
      const buttonEl = await page.$('.btn-secondary');
      await buttonEl.click().then(() => buttonEl.$eval('svg', el => el.getAttribute('class')).then(attr => expect(attr).toContain('ripple-effect')));
    });

    it('should click on "Disabled Secondary Button", and not animate', async () => {
      await page.$$('.btn-secondary').then(async (elArr) => {
        await elArr[1].click();
        expect(await elArr[1].evaluate(e => e.disabled)).toBeTruthy();
        expect((await elArr[1].$$('svg.ripple-effect')).length).toBe(0);
      });
    });

    it('should tab to "Tertiary Button", and animate on enter', async () => {
      await page.focus('.btn-secondary');
      await tabKey(2);
      await page.keyboard.press('Enter');
      await page.$eval('.btn-tertiary svg', el => el.getAttribute('class')).then(attr => expect(attr).toContain('ripple-effect'));
    });

    it('should click on "Tertiary Button", and animate on click', async () => {
      const buttonEl = await page.$('.btn-tertiary');
      await buttonEl.click().then(() => buttonEl.$eval('svg', el => el.getAttribute('class')).then(attr => expect(attr).toContain('ripple-effect')));
    });

    it('should click on "Disabled Tertiary Button", and not animate', async () => {
      await page.$$('.btn-tertiary').then(async (elArr) => {
        await elArr[1].click();
        expect(await elArr[1].evaluate(e => e.disabled)).toBeTruthy();
        expect((await elArr[1].$$('svg.ripple-effect')).length).toBe(0);
      });
    });

    it('should tab to "Icon Button", and animate on enter', async () => {
      await page.focus('.btn-tertiary');
      await tabKey(2);
      await page.keyboard.press('Enter');
      await page.$eval('#maincontent .btn-icon svg', el => el.getAttribute('class')).then(attr => expect(attr).toContain('ripple-effect'));
    });

    it('should click on "Icon Button", and animate on click', async () => {
      const buttonEl = await page.$('#maincontent .btn-icon');
      await buttonEl.click().then(() => buttonEl.$eval('svg', el => el.getAttribute('class')).then(attr => expect(attr).toContain('ripple-effect')));
    });

    it('should click on "Disabled Icon Button", and not animate', async () => {
      await page.$$('#maincontent .btn-icon').then(async (elArr) => {
        await elArr[1].click();
        expect(await elArr[1].evaluate(e => e.disabled)).toBeTruthy();
        expect((await elArr[1].$$('svg.ripple-effect')).length).toBe(0);
      });
    });
  });

  describe('Button with hitbox test', () => {
    const url = `${baseUrl}/example-button-with-hitbox.html`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should have 44px height, and 44px minimum width in button with hitbox', async () => {
      const hboxHeight = await page.$eval('span[class="hitbox-area"]', el => getComputedStyle(el).getPropertyValue('height'));
      expect(hboxHeight).toMatch('44px');
    });

    it('should have the hitbox area clickable', async () => {
      await page.click('a.btn-menu span.hitbox-area');
      await page.waitForSelector('#popupmenu-2', { visible: true });
    });
  });

  describe('Button with change style test', () => {
    const url = `${baseUrl}/test-button-change-style.html`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should have change style', async () => {
      expect(await page.$eval('#btn-primary-target', el => el.getAttribute('class'))).not.toContain('btn-secondary');
      expect(await page.$eval('#btn-primary-target', el => el.getAttribute('class'))).toContain('btn-primary');
      await page.click('#btn-style-changer');
      expect(await page.$eval('#btn-primary-target', el => el.getAttribute('class'))).not.toContain('btn-primary');
      expect(await page.$eval('#btn-primary-target', el => el.getAttribute('class'))).toContain('btn-secondary');
      expect(await page.$eval('#btn-primary-target', el => getComputedStyle(el).getPropertyValue('height'))).toMatch('34px');
    });
  });

  describe('Button notification badge toggle test', () => {
    const url = `${baseUrl}/test-badge-toggle.html`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should toggle on/off the notification badge in button', async () => {
      const notifbadgeContainer = () => page.$eval('#primary-action-one > span.notification-badge-container', element => element.innerHTML);
      const elem = () => page.evaluate(() => document.querySelector('#primary-action-one > span.notification-badge-container'));

      // toggle off the notification badge
      await page.click('#toggle-off');
      expect(await elem()).toBeFalsy();
      // toggle on the notification badge
      await page.click('#toggle-on');
      expect(await elem()).toBeTruthy();
      expect(await notifbadgeContainer()).toContain('notification-dot-lower-left');
    });
  });
});

