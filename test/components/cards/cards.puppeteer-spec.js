const { getConfig } = require('../../helpers/e2e-utils.js');

describe('Cards actionable button tests', () => {
  const url = 'http://localhost:4000/components/cards/example-actionable';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await page.setViewport({ width: 1920, height: 1080 });
  });
  
  it('should run visual test', async () => {
    await page.waitForSelector('.btn');
    await page.click('#actionable-btn-1'); 
    await page.keyboard.press('Tab');
    await page.hover('#actionable-btn-2');
    const image = await page.screenshot(); 
    const config = getConfig('cards-actionbutton'); 
    expect(image).toMatchImageSnapshot(config); 
  });
});
