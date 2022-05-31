describe('Button with hitbox test', () => {
  const url = 'http://localhost:4000/components/button/example-button-with-hitbox';
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

describe('Button notifBadge test', () => {
  const url = 'http://localhost:4000/components/button/test-badge-toggle.html';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

  it('should toggle on/off the notification badge in button', async () => {
    const notifbadgeContainer = () => page.$eval('#primary-action-one > span.notification-badge-container', element => element.innerHTML);
    const elem = () => page.evaluate(() => !!document.querySelector('#primary-action-one > span.notification-badge-container'));

    // toggle off the notification badge
    await page.click('#toggle-off');
    expect(await elem()).toBe(false);
    // toggle on the notification badge
    await page.click('#toggle-on');
    expect(await elem()).toBe(true);
    expect(await notifbadgeContainer()).toContain('notification-dot-lower-left');
  });
});
