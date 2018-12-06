const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');
const axePageObjects = requireHelper('axe-page-objects');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Modal init example-modal tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/modal/example-index');
    const modalEl = await element(by.id('add-context'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(modalEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (!utils.isIE()) {
    it('Should be accessible on init with no WCAG 2AA violations on example-modal', async () => {
      const res = await axePageObjects(browser.params.theme);

      expect(res.violations.length).toEqual(0);
    });
  }

  it('Should have modal closed by default', async () => {
    expect(await element(by.css('body')).getAttribute('class')).not.toContain('modal-engaged');
  });

  it('Should open modal on tab, and enter', async () => {
    const modalEl = await element(by.id('add-context'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(modalEl), config.waitsFor);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await element(by.css('body')).sendKeys(protractor.Key.TAB);
    await modalEl.sendKeys(protractor.Key.ENTER);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('overlay'))), config.waitsFor);

    expect(await element(by.css('body')).getAttribute('class')).toContain('modal-engaged');
  });

  it('Should close modal on tab, and escape', async () => {
    const modalEl = await element(by.id('add-context'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(modalEl), config.waitsFor);
    await modalEl.sendKeys(protractor.Key.ENTER);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-engaged'))), config.waitsFor);

    expect(await element(by.css('body')).getAttribute('class')).toContain('modal-engaged');
    await element(by.css('body')).sendKeys(protractor.Key.ESCAPE);
    await browser.driver.sleep(config.sleep);
    await element(by.css('body')).sendKeys(protractor.Key.ESCAPE);
    await browser.driver
      .wait(protractor.ExpectedConditions.stalenessOf(element(by.className('overlay'))), config.waitsFor);

    expect(await element(by.css('body')).getAttribute('class')).not.toContain('modal-engaged');
  });

  if (utils.isChrome()) {
    it('Should have focus remain in the dialog on outside click', async () => {
      const modalEl = await element(by.id('add-context'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(modalEl), config.waitsFor);

      await modalEl.sendKeys(protractor.Key.ENTER);
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.className('overlay'))), config.waitsFor);

      expect(await element(by.css('body')).getAttribute('class')).toContain('modal-engaged');
      await browser.driver.actions().mouseMove(modalEl).click().perform();
      await browser.driver.sleep(config.sleep);

      expect(await element(by.css('body')).getAttribute('class')).toContain('modal-engaged');
    });
  }
});

describe('Modal open example-modal tests on click', () => {
  beforeEach(async () => {
    await utils.setPage('/components/modal/example-index');
    const modalEl = await element(by.id('add-context'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(modalEl), config.waitsFor);
    await modalEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('overlay'))), config.waitsFor);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on example-index', async () => {
      await browser.driver.sleep(config.sleep);
      const bodyEl = await element(by.className('modal-engaged'));

      expect(await browser.protractorImageComparison.checkElement(bodyEl, 'modal-open')).toEqual(0);
    });
  }

  if (!utils.isIE()) {
    xit('Should be accessible on open with no WCAG 2AA violations on example-modal', async () => {
      const res = await axePageObjects(browser.params.theme);

      expect(res.violations.length).toEqual(0);
    });
  }

  it('Should open modal on click', async () => {
    expect(await element(by.css('.modal.is-visible')).isDisplayed()).toBeTruthy();
  });
});

describe('Modal example-close-btn tests', () => {
  it('Should close the modal via the x close icon', async () => {
    await utils.setPage('/components/modal/example-close-btn');

    const modalBtn = await element(by.id('add-context'));
    await modalBtn.click();

    expect(await element(by.css('body')).getAttribute('class')).toContain('modal-engaged');

    const closeBtn = await element(by.css('button.btn-close'));
    await closeBtn.click();

    expect(await element(by.css('body')).getAttribute('class')).not.toContain('modal-engaged');
  });
});

describe('Modal example-validation tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/modal/example-validation');
    const modalEl = await element(by.css('button[data-modal="modal-1"]'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(modalEl), config.waitsFor);
    await modalEl.sendKeys(protractor.Key.ENTER);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('overlay'))), config.waitsFor);
  });

  if (utils.isChrome()) {
    it('Should focus on first focusable item in modal', async () => {
      const dropdownEl = await element.all(by.css('div.dropdown')).first();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await dropdownEl.getAttribute('class')).toEqual(await browser.driver.switchTo().activeElement().getAttribute('class'));
    });

    it('Should show validation errors in modal', async () => {
      await element(by.id('context-name')).click();
      await browser.driver.sleep(config.sleep);
      await element(by.id('context-name')).sendKeys('to');
      await browser.driver.sleep(config.sleep);
      await element(by.id('context-desc')).click();
      await browser.driver.sleep(config.sleep);
      await element(by.id('context-name')).click();
      await browser.driver.sleep(config.sleep);

      const errors = [
        await element.all(by.className('message-text')).get(0),
        await element.all(by.className('message-text')).get(1),
        await element.all(by.className('message-text')).get(2)
      ];

      expect(await errors[0].getText()).toEqual('Required');
      expect(await errors[1].getText()).toEqual('Email address not valid');
      expect(await errors[2].getText()).toEqual('Required');
    });

    it('Should enable submit', async () => {
      expect(await element(by.id('submit')).isEnabled()).toBe(false);

      const dropdownEl = await element(by.css('div[aria-controls="dropdown-list"]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);
      await dropdownEl.click();
      const dropdownSearchEl = await element(by.id('dropdown-search'));
      await dropdownSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownSearchEl.sendKeys(protractor.Key.ENTER);
      await browser.driver.sleep(config.sleep);

      await element(by.id('context-name')).sendKeys('test@test.com');
      await element(by.id('context-desc')).sendKeys('test description');
      await browser.driver.sleep(config.sleep);

      expect(await element(by.id('submit')).isEnabled()).toBe(true);
    });
  }
});

describe('Modal example-validation-editor tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/modal/test-validation-editor');
    const modalEl = await element(by.css('button[data-modal="modal-1"]'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(modalEl), config.waitsFor);
    await modalEl.sendKeys(protractor.Key.ENTER);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('overlay'))), config.waitsFor);
  });

  it('Should enable submit after add text to all fields', async () => {
    expect(await element(by.id('submit')).isEnabled()).toBe(false);

    const dropdownEl = await element.all(by.css('.modal div[aria-controls="dropdown-list"]')).first();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);
    await dropdownEl.click();
    const dropdownSearchEl = await element(by.id('dropdown-search'));
    await dropdownSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownSearchEl.sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);

    await element(by.id('context-name')).sendKeys('test@test.com');
    await element(by.id('context-desc')).sendKeys('test description');
    await element(by.css('.editor')).sendKeys('test description');
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('submit')).isEnabled()).toBe(true);
  });
});

describe('Modal manual content loading', () => {
  beforeEach(async () => {
    await utils.setPage('/components/modal/test-manual-open');
  });

  it('should load content without immediately displaying the modal', async () => {
    const loadButtonEl = await element(by.css('#load-content'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(loadButtonEl), config.waitsFor);
    await loadButtonEl.click();

    // 1501 = 1ms longer than the visual test's simulated load time.
    await browser.driver.sleep(1501);

    // Expect the modal element to be drawn
    expect(await element(by.css('#my-id')).getAttribute('class')).toContain('modal');

    const displayButtonEl = await element(by.css('#show-modal'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(displayButtonEl), config.waitsFor);
    await displayButtonEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('modal-engaged'))), config.waitsFor);

    // Expect the modal to be engaged with a Multiselect present
    expect(await element(by.css('body')).getAttribute('class')).toContain('modal-engaged');
    expect(await element(by.css('#test-multiselect')).getAttribute('value')).toEqual('1');
  });
});
