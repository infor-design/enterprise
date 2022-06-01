describe('Button Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/button';

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

