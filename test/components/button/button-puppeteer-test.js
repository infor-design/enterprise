describe('Button Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/button';

  describe('Index tests', () => {
    const url = `${baseUrl}/example-index`;

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

    it('should click on "Disabled Primary Button", and not animate', async () => {
      await page.$$('.btn-primary').then(async (elArr) => {
        await elArr[1].click();
        expect(await elArr[1].evaluate(e => e.disabled)).toBeTruthy();
        expect((await elArr[1].$$('svg.ripple-effect')).length).toBe(0);
      });
    });

    it('should click on "Disabled Secondary Button", and not animate', async () => {
      await page.$$('.btn-secondary').then(async (elArr) => {
        await elArr[1].click();
        expect(await elArr[1].evaluate(e => e.disabled)).toBeTruthy();
        expect((await elArr[1].$$('svg.ripple-effect')).length).toBe(0);
      });
    });

    it('should click on "Disabled Tertiary Button", and not animate', async () => {
      await page.$$('.btn-tertiary').then(async (elArr) => {
        await elArr[1].click();
        expect(await elArr[1].evaluate(e => e.disabled)).toBeTruthy();
        expect((await elArr[1].$$('svg.ripple-effect')).length).toBe(0);
      });
    });
  });

  describe('Button with icons test', () => {
    const url = `${baseUrl}/example-with-icons?theme=classic`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should open menu on return', async () => {
      await page.waitForSelector('#menu-button-alone', { visible: true });
      await page.focus('#menu-button-alone');
      await page.keyboard.press('Enter');
      await page.waitForSelector('#menu-button-alone', { visible: true })
        .then(async (element) => {
          const className = await (await element.getProperty('className')).jsonValue();
          const ariaPopup = await element.evaluate(e => e.getAttribute('aria-haspopup'));

          expect(className).toContain('is-open');
          expect(ariaPopup).toBe('true');
        });
      await page.click('#menu-button-alone');
    });

    it('should open menu on click', async () => {
      await page.waitForSelector('#menu-button-alone', { visible: true });
      await page.click('#menu-button-alone');
      await page.waitForSelector('#menu-button-alone', { visible: true })
        .then(async (element) => {
          const className = await (await element.getProperty('className')).jsonValue();
          const ariaPopup = await element.evaluate(e => e.getAttribute('aria-haspopup'));

          expect(className).toContain('is-open');
          expect(ariaPopup).toBe('true');
        });
      await page.click('#menu-button-alone');
    });
  });

  describe('Button toggle test', () => {
    const url = `${baseUrl}/example-toggle-button`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should toggle', async () => {
      await page.waitForSelector('#favorite-1', { visible: true });

      const toggle = await page.$('#favorite-1');
      await toggle.click();

      await toggle.evaluate(e => e.getAttribute('aria-pressed')).then(ariaPressed => expect(ariaPressed).toBe('false'));
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

  describe('Button remove more tooltip test', () => {
    const url = `${baseUrl}/test-remove-more-tooltip?layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not display tooltip when hovering the button', async () => {
      const button = await page.$('#btn-1');
      await button.hover();

      await page.$('#tooltip')
        .then(e => e.getProperty('className'))
        .then(json => json.jsonValue())
        .then(className => expect(className).not.toContain('is-open'));
    });

    it('should display "More" text when hovering the button', async () => {
      const button = await page.$('#btn-2');
      await button.hover();

      await page.waitForSelector('#tooltip', { visible: true })
        .then(element => element.evaluate(e => e.textContent))
        .then(text => expect(text.trim()).toEqual('More'));
    });

    it('should display "Tooltip will show" text when hovering the button', async () => {
      const button = await page.$('#btn-3');
      await button.hover();

      await page.waitForSelector('#tooltip', { visible: true })
        .then(element => element.evaluate(e => e.textContent))
        .then(text => expect(text.trim()).toEqual('Tooltip will show'));
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

