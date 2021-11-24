describe('Breadcrumb puppeteer tests', () => {
  const url = 'http://localhost:4000/components/breadcrumb/example-with-hitbox.html';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

  it('should have the size of 44px in height, 8px padding-right & 16px font-size in header flex & with hitbox section ', async () => {
    const headFlex = await page.$eval('a[class="hyperlink hide-focus"]', el => getComputedStyle(el, ':after').height);
    const padRight = await page.$eval('a[class="hyperlink hide-focus"]', el => getComputedStyle(el, ':after').paddingRight);
    const padLeft = await page.$eval('a[class="hyperlink hide-focus"]', el => getComputedStyle(el, ':after').paddingLeft);
    const fontSize = await page.$eval('a[class="hyperlink hide-focus"]', el => getComputedStyle(el, ':after').fontSize);
    expect(headFlex).toMatch('44px');
    expect(padRight).toMatch('8px');
    expect(padLeft).toMatch('8px');
    expect(fontSize).toMatch('16px');
  });
});
