describe('Notification example-index Puppeteer Tests', () => {
  const url = 'http://localhost:4000/components/notification/example-index.html';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

  it('should be able to set ids/automation ids', async () => {
    const notif4 = await page.$eval('#notification-id-4', element => element.getAttribute('id'));
    const n4 = await page.$eval('#notification-id-4', element => element.getAttribute('data-automation-id'));
    expect(notif4).toMatch('notification-id-4');
    expect(n4).toMatch('notification-automation-id-4');

    const notif3 = await page.$eval('#notification-id-3', element => element.getAttribute('id'));
    const n3 = await page.$eval('#notification-id-3', element => element.getAttribute('data-automation-id'));
    expect(notif3).toMatch('notification-id-3');
    expect(n3).toMatch('notification-automation-id-3');

    const notif2 = await page.$eval('#notification-id-2', element => element.getAttribute('id'));
    const n2 = await page.$eval('#notification-id-2', element => element.getAttribute('data-automation-id'));
    expect(notif2).toMatch('notification-id-2');
    expect(n2).toMatch('notification-automation-id-2');

    const notif1 = await page.$eval('#notification-id-1', element => element.getAttribute('id'));
    const n1 = await page.$eval('#notification-id-1', element => element.getAttribute('data-automation-id'));
    expect(notif1).toMatch('notification-id-1');
    expect(n1).toMatch('notification-automation-id-1');
  });
});

describe('Notification example-widget tests', () => {
  const url = 'http://localhost:4000/components/notification/example-widget.html';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

  it('should show the tooltip when notification is hovered', async () => {
    await page.hover('.notification.alert p.notification-text');
    const tooltip1 = await page.waitForSelector('.has-open-tooltip', { visible: true });
    expect(tooltip1).toBeTruthy();
  });
});

describe('Notification test-custom-tooltip-close-btn tests', () => {
  const url = 'http://localhost:4000/components/notification/test-updated-misfire.html';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

  it('should Create and close notifications using the buttons shown', async () => {
    await page.hover('#open');
    await page.click('#open');
    const notif1 = await page.waitForSelector('#notification-id-1', { visible: true });
    expect(notif1).toBeTruthy();

    await page.hover('#close');
    await page.click('#close');
    const isClosed = await page.waitForSelector('#notification-id-1', { hidden: true });
    expect(isClosed).toBeFalsy();

    await page.hover('#open');
    await page.click('#open');
    await page.hover('#close-all');
    await page.click('#close-all');
    const closeAll = await page.waitForSelector('#notification-id-1', { hidden: true });
    expect(closeAll).toBeFalsy();
  });
});
