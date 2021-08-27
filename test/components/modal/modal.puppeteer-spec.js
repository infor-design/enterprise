describe('Modal Puppeteer Test', () => {
  const url = 'http://localhost:4000/components/modal/example-index';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

  it('should not have error', async () => {
    await page.on('error', function (err) {
      const theTempValue = err.toString();
      console.log(`Error: ${theTempValue}`);
    }); 
  });

  it('Should open modal on tab, and enter', async () => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    const visibleModal = await page.waitForSelector('.modal.is-visible.is-active', { visible: true });
    expect(visibleModal).toBeTruthy();
  });

  it('should close modal on tab, and escape', async () => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.modal.is-visible.is-active', { visible: true });
    await page.keyboard.press('Escape');
    const closeModal = await page.$('.modal.is-visible.is-active');
    expect(closeModal).toBeFalsy();
  });
});
describe('Modal example-validation-editor tests', () => {
  const url = 'http://localhost:4000/components/modal/test-validation-editor';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await page.waitForSelector('.btn-secondary');
    await page.click('.btn-secondary');
    await page.waitForSelector('.modal-wrapper');
  });

  it('Should enable submit after add text to all fields', async () => {
    await page.click('.dropdown-wrapper');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.type('#context-name', 'test@test.com');
    await page.type('#context-desc', 'test description');
    await page.type('.editor', 'test description!^');
    const element = await page.waitForSelector('#submit');
    expect(element).toBeTruthy();
    await page.click('#submit');
  });
});
