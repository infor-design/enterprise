const { getConfig } = require('../../helpers/e2e-utils');
const config = require('../../helpers/e2e-config');

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

    it('should not visually regress', async () => {
      await page.waitForSelector('#menu-button-alone', { visible: true });

      const maincontent = await page.$('#maincontent');
      const image = await maincontent.screenshot();

      const btnIcon = getConfig('button-icon');
      expect(image).toMatchImageSnapshot(btnIcon);
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

  describe('Button 100 percent test', () => {
    const url = `${baseUrl}/example-100-percent?theme=classic`;
    let windowSize;

    const snap = async (width, height) => {
      await page.setViewport({ width, height });
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.waitForTimeout(config.sleep);

      const maincontent = await page.$('#maincontent');
      const image = await maincontent.screenshot();

      const snapshot = getConfig(`button-100-${width}`);
      expect(image).toMatchImageSnapshot(snapshot);
    };

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      windowSize = await page.viewport();
    });

    afterEach(async () => {
      await page.waitForTimeout(config.sleep);
    });

    afterAll(async () => {
      await page.setViewport(windowSize);
    });

    it('should tab onto button, show focus, and not visual regress', async () => {
      await page.focus('#one-hundred');
      await page.keyboard.press('Tab');
      await page.waitForTimeout(config.sleep);

      const fitty = await page.$('#fitty');
      const image = await fitty.screenshot();

      const snapshot = getConfig('button-100');
      expect(image).toMatchImageSnapshot(snapshot);
    });

    it('should not visual regress on example-100-percent at 1280px', async () => {
      await snap(1280, 800);
    });

    it('should not visual regress on example-100-percent at 768px', async () => {
      await snap(768, 1024);
    });

    it('should not visual regress on example-100-percent at 500px', async () => {
      await snap(500, 600);
    });

    it('should not visual regress on example-100-percent at 320px', async () => {
      await snap(320, 480);
    });
  });

  describe('Button secondary border test', () => {
    const url = `${baseUrl}/test-secondary-border.html?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visual regress', async () => {
      const maincontent = await page.$('div[role=main]');
      const image = await maincontent.screenshot();

      const snapshot = getConfig('button-secondary-border');
      expect(image).toMatchImageSnapshot(snapshot);
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
        .then(text => expect(text).toEqual('More'));
    });

    it('should display "Tooltip will show" text when hovering the button', async () => {
      const button = await page.$('#btn-3');
      await button.hover();

      await page.waitForSelector('#tooltip', { visible: true })
        .then(element => element.evaluate(e => e.textContent))
        .then(text => expect(text).toEqual('Tooltip will show'));
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

