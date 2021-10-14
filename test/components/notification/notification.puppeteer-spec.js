describe('Modal example-widget tests', () => {
  const url = 'http://localhost:4000/components/notification/example-widget.html';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

  it('Should show the tooltip when notification is hovered', async () => {
    await page.hover('.notification.alert p.notification-text');
    await page.waitForTimeout(200);
    const tooltip1 = await page.waitForSelector('.has-open-tooltip', { visible: true });
    expect(tooltip1).toBeTruthy();
  });
});
