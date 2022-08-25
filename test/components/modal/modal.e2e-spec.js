const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

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
      const dropdownEl = await element(by.css('div.dropdown'));
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
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('.modal-wrapper'))), config.waitsFor);
  });

  it('Should enable submit after add text to all fields', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('#submit'))), config.waitsFor);

    const dropdownEl = await element.all(by.css('.modal div.dropdown')).first();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(dropdownEl), config.waitsFor);
    await dropdownEl.click();
    await browser.driver.sleep(config.sleep);

    const dropdownSearchEl = await element(by.id('dropdown-search'));
    await dropdownSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownSearchEl.sendKeys(protractor.Key.ARROW_DOWN);
    await dropdownSearchEl.sendKeys(protractor.Key.ENTER);
    await browser.driver.sleep(config.sleep);

    await element(by.id('context-name')).sendKeys('test@test.com');
    await element(by.id('context-desc')).sendKeys('test description');
    await element(by.css('.editor')).sendKeys('test description');
    await browser.driver.sleep(config.sleepLonger);
    await browser.wait(protractor.ExpectedConditions.elementToBeClickable(element(by.css('#submit'))), config.waitsFor);

    expect(await element(by.css('#submit')).isEnabled()).toBeTruthy();
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

describe('Modal No Auto Focus', () => {
  beforeEach(async () => {
    await utils.setPage('/components/modal/test-no-autofocus.html');
  });

  it('Should not focus any fields with autoFocus false', async () => {
    await element(by.id('show-modal')).click();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(element(by.id('modal-1'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);

    expect(await browser.driver.switchTo().activeElement().getAttribute('id')).toEqual('show-modal');
  });
});

describe('Modal Full Content Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/modal/example-full-content');
  });

  it('should be able to reopen', async () => {
    await element(by.css('#show')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(element(by.id('modal'))), config.waitsFor);

    expect(await element(by.id('modal')).getAttribute('class')).toContain('is-visible');
    await element.all(by.css('.modal-buttonset button')).first().click();

    expect(await element(by.id('modal')).getAttribute('class')).not.toContain('is-visible');
    await browser.driver.sleep(config.sleepLonger);

    await element(by.css('#show')).click();
    await browser.driver.sleep(config.sleepLonger);

    expect(await element(by.id('modal')).getAttribute('class')).toContain('is-visible');
    await element.all(by.css('.modal-buttonset button')).first().click();
  });
});

describe('Modal xss tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/modal/test-escaped-title');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should show encoded data in the title', async () => {
    const buttonEl = await element(by.id('show-modal'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(buttonEl), config.waitsFor);
    await buttonEl.click();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(element(by.css('.modal'))), config.waitsFor);

    expect(await element(by.css('.modal .modal-title')).getText()).toEqual('<script>alert("menuXSS")</script>');
  });
});

describe('Modal button tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/modal/test-inline-buttons?theme=classic');
    const modalEl = await element(by.id('btn-show-modal'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(modalEl), config.waitsFor);
    await modalEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('overlay'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on 4 buttons', async () => {
      const bodyEl = await element(by.className('modal-engaged'));

      expect(await browser.imageComparison.checkElement(bodyEl, 'modal-buttons')).toEqual(0);
    });
  }
});

describe('Modal overlay opacity tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/modal/test-overlay-opacity');
    const buttonEl = await element(by.id('add-context'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
    await buttonEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('overlay'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to set overlay opacity to 30%', async () => {
    await browser.driver.sleep(config.sleep);
    const overlayEl = await element(by.css('.overlay'));

    expect(await overlayEl.getCssValue('background')).toContain('rgba(0, 0, 0, 0.3)');
  });
});

describe('Modal iframe focus tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/modal/test-iframe');

    // Switch to the iframe
    await browser.switchTo().frame(await element(by.css('#maincontent')).getWebElement());

    const buttonEl = await element(by.id('add-context'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
    await buttonEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('overlay'))), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should correctly focus the first focusable element inside the Modal if focus is lost, and the user presses Tab', async () => {
    // Temporarily sleep while we wait for focus to be set by the Modal.
    await browser.driver.sleep(config.sleepLonger);

    // Click the overlay to defocus the first element
    // NOTE: directly clicking the element causes "Element click intercepted" errors in Protractor,
    // so we give it arbitrary coordinates instead (which still clicks the overlay).
    // await element(by.className('overlay')).click();
    await browser.driver.actions().mouseMove({ x: 20, y: 150 }).mouseDown().perform();

    // Press "Tab" key.  This should NOT cause the "Add Context" button to focus.
    await browser.driver.actions().sendKeys(protractor.Key.TAB).perform();

    // Detect if the elements are the same by comparing IDs
    const targetElemId = await element(by.css('#subject')).getAttribute('id');
    const focusedElemId = await browser.driver.switchTo().activeElement().getAttribute('id');

    expect(focusedElemId).toEqual(targetElemId);
  });
});

describe('Nested Modal keyboard access tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/modal/test-nested');
    const buttonEl = await element(by.id('open-first-modal'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
  });

  it('can use the keyboard to escape from nested modals', async () => {
    // Open all three modals
    await element(by.id('open-first-modal')).click();
    await browser.driver.sleep(config.sleep);
    await element(by.id('open-second-modal')).click();
    await browser.driver.sleep(config.sleep);
    await element(by.id('open-third-modal')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('#ids-modal-root')).getAttribute('aria-hidden')).toBe(null);

    // Close all three modals with the ESCAPE key
    await browser.driver.actions().sendKeys(protractor.Key.ESCAPE).perform();
    await browser.driver.sleep(config.sleep);
    await browser.driver.actions().sendKeys(protractor.Key.ESCAPE).perform();
    await browser.driver.sleep(config.sleep);
    await browser.driver.actions().sendKeys(protractor.Key.ESCAPE).perform();
    await browser.driver.sleep(config.sleep);

    // No modals should be active, and all aria attributes set
    expect(await element(by.css('body')).getAttribute('class')).not.toContain('modal-engaged');
    expect(await element(by.css('#ids-modal-root')).getAttribute('aria-hidden')).not.toBe(null);
  });
});

describe('Modal with external components tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/modal/test-external-components?layout=nofrills');
    const buttonEl = await element(by.id('add-context'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
    await buttonEl.click();
    await browser.driver.sleep(config.sleep);
  });

  it('should be able to tab into Popover elements from within the Modal', async () => {
    // Tab to the Popover trigger button
    await browser.driver.actions().sendKeys(protractor.Key.TAB).perform();
    await browser.driver.actions().sendKeys(protractor.Key.TAB).perform();
    await browser.driver.actions().sendKeys(protractor.Key.TAB).perform();

    // Activate the popover
    await browser.driver.actions().sendKeys(protractor.Key.ENTER).perform();
    await browser.driver.sleep(config.sleep);

    // Press tab, which should tab into the Popover and focus the close button
    await browser.driver.actions().sendKeys(protractor.Key.TAB).perform();
    const focusedElemText = await browser.driver.switchTo().activeElement().getText();

    // Check the text content of the button for accuracy
    expect(focusedElemText).toEqual('Close');
  });
});

describe('Modal focusable elements tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/modal/test-focusable-elements?layout=nofrills');
    const buttonEl = await element(by.id('add-context'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
    await buttonEl.click();
    await browser.driver.sleep(config.sleep);
  });

  it('Should focus the first available field', async () => {
    const focusedElem = await browser.driver.switchTo().activeElement();

    expect(focusedElem.getAttribute('class')).toContain('dropdown');
  });
});
