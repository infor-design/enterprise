describe('Counts example-index tests', () => {
  const url = 'http://localhost:4000/components/counts/example-index.html';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

  it('should have the size of 48px in xl-text font size', async () => {
    const fontSize = await page.$eval('span[class="xl-text"]', el => getComputedStyle(el).getPropertyValue('font-size'));
    expect(fontSize).toMatch('48px');
  });
});

describe('Counts example-widget-count tests', () => {
  const url = 'http://localhost:4000/components/counts/example-widget-count?&locale=he-IL';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

  it('should have the title in center and below the counts', async () => {
    const textAlign = await page.$eval('span[class="title"]', el => getComputedStyle(el).getPropertyValue('text-align'));
    expect(textAlign).toMatch('center');
  });
});
