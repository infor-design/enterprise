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
