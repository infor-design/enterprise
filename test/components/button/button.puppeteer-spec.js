describe('Button with hitbox test', () => {
  const url = 'http://localhost:4000/components/button/example-button-with-hitbox';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

  it('should have 44px height and min width for btn with hitbox', async () => {
    
    const height = await page.$eval('span[class="hitbox-area"]', el =>
    getComputedStyle(el).getPropertyValue('height'));
    const minWidth = await page.$eval('span[class="hitbox-area"]', el => getComputedStyle(el).getPropertyValue('min-width'));
    expect(height).toMatch('44px');
    expect(minWidth).toMatch('44px');

  });
});
