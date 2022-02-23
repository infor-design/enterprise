describe('Swipe Container puppeteer mobile enhancements tests', () => {
  const url = 'http://localhost:4000/components/swipe-action/example-index.html';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await page.setViewport({ width: 1920, height: 1080 });
  });

  it('should have 16px spacing on each sides', async () => {
    const padLeft = await page.$eval('div[class="card-content"]', el => getComputedStyle(el).getPropertyValue('padding-left'));
    expect(padLeft).toMatch('16px');

    const padRight = await page.$eval('div[class="card-content"]', el => getComputedStyle(el).getPropertyValue('padding-right'));
    expect(padRight).toMatch('16px');
  });

  it('should have a text container with 87px width ', async () => {
    const boxWdt = await page.$eval('div[class="swipe-action-text-container"]', el => getComputedStyle(el).getPropertyValue('width'));
    expect(boxWdt).toMatch('87px');
  });
});
