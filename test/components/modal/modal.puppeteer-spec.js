describe('Modal Puppeteer init example-modal tests', () => {
  const url = 'http://localhost:4000/components/modal/example-index';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
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

describe('Modal open example-modal tests on click', () => {
  const url = 'http://localhost:4000/components/modal/example-index?theme=classic';
  beforeEach(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await page.waitForSelector('#add-context');
    await page.click('#add-context');
    await page.waitForSelector('.overlay');
  });

  it('Should open modal on click', async () => {
    expect(await page.waitForSelector('.modal, is-visible')).toBeTruthy();
  });
});

describe('Modal example-close-btn tests', () => {
  const url = 'http://localhost:4000/components/modal/example-close-btn';
  beforeEach(async () => {
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

  it('Should close the modal via the x close icon', async () => {
    await page.click('#add-context');

    await page.waitForSelector('.modal-engaged', { visible: true });
    await page.waitForTimeout(200);
    const button = await page.waitForSelector('#add-context-modal-btn-close');
    await button.hover();
    await button.click();
    await page.waitForSelector('.modal-engaged', { hidden: true });
  });

  it('Should be able to set id/automation id', async () => {
    await page.click('#add-context');

    await page.waitForSelector('.modal-engaged', { visible: true });
    await page.waitForTimeout(200);

    const title = await page.$eval('#add-context-modal-title',
      element => element.getAttribute('id'));
    const text = await page.$eval('#add-context-modal-text',
      element => element.getAttribute('id'));
    const modal = await page.$eval('#add-context-modal',
      element => element.getAttribute('id'));

    if (title !== 'add-context-modal-title' || text !== 'add-context-modal-text' || modal !== 'add-context-modal') {
      throw console.error('ERROR');
    }
  }); 
});

describe('Modal example-validation tests', () => {
  const url = 'http://localhost:4000/components/modal/example-validation';
  beforeEach(async () => {
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await page.click('.btn-secondary');
  });

  it('Should focus on first focusable item in modal', async () => {
    const dropdown = await page.evaluateHandle(() => document.activeElement);
    await dropdown.type('div.dropdown');
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

describe('Modal test-custom-tooltip-close-btn tests', () => {
  const url = 'http://localhost:4000/components/modal/test-custom-tooltip-close-btn.html';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

  it('it should open the tooltip', async () => {
    await page.click('#add-context');
    await page.waitForSelector('.modal-engaged', { visible: true });
    await page.hover('#add-context-modal-btn-close');
    const tooltip = await page.waitForSelector('.has-open-tooltip, .has-tooltip', { visible: true });
    expect(tooltip).toBeTruthy();
  });

  it('it should have custom attribute tabIndex:-1', async () => {
    await page.click('#add-context');
    await page.waitForSelector('.modal-engaged', { visible: true });
    
    const tabIndex = await page.$eval('#add-context-modal-btn-close',
      element => element.getAttribute('tabindex'));
    if (tabIndex !== '-1') {
      throw console.error('Tab Index value changed');
    }
  });
});
