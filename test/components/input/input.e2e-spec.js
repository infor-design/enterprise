const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

const inputId = 'first-name';

describe('Input example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/input/example-index?theme=classic&layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id(inputId))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to type on in an input', async () => {
    const inputEl = await element(by.id(inputId));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(inputEl), config.waitsFor);

    await inputEl.clear();
    await inputEl.sendKeys('co');

    expect(await inputEl.getAttribute('value')).toEqual('co');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const inputEl = await element(by.id(inputId));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(inputEl), config.waitsFor);

      await inputEl.clear();
      await inputEl.sendKeys('co');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'input-index')).toEqual(0);
    });
  }
});

describe('Input Test Reset', () => {
  beforeEach(async () => {
    await utils.setPage('/components/input/test-dirty-reset?layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id('department-code'))), config.waitsFor);
  });

  xit('Should be able to reset the dirty indicator', async () => {
    // Change the input
    await element(by.id('department-code')).sendKeys('Test');
    await element(by.id('department-code')).sendKeys(protractor.Key.TAB);

    // Change the dropdown
    const dropdownEl = await element(by.css('#dropdown-dirty + .dropdown-wrapper div.dropdown'));
    await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);

    const searchEl = await element(by.css('.dropdown-search'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(searchEl), config.waitsFor);

    await browser.switchTo().activeElement().sendKeys(protractor.Key.ARROW_DOWN);
    await browser.switchTo().activeElement().sendKeys(protractor.Key.ENTER);

    expect(await element(by.id('dropdown-dirty')).getAttribute('value')).toEqual('a');

    // Change the textarea
    await element(by.id('description-dirty')).sendKeys('Test');
    await element(by.id('description-dirty')).sendKeys(protractor.Key.TAB);

    // Click the text box
    await browser.actions().sendKeys(protractor.Key.SPACE).perform();
    await browser.actions().sendKeys(protractor.Key.TAB).perform();

    expect(await element.all(by.css('.icon-dirty')).count()).toEqual(4);
    await element(by.id('btn-save')).click();
    await browser.driver.sleep(config.sleepShort);

    expect(await element.all(by.css('.icon-dirty')).count()).toEqual(0);
  });
});

describe('Input tooltip tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/input/test-tooltips?layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id('first-name'))), config.waitsFor);
  });

  // This test is more important as a windows test
  it('Should be able to select text', async () => {
    const inputEl = await element(by.id('first-name'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(inputEl), config.waitsFor);

    await inputEl.sendKeys(protractor.Key.chord(
      protractor.Key.COMMAND,
      protractor.Key.SHIFT,
      protractor.Key.ARROW_LEFT
    ));

    // get highlighted text
    const highligtedText = utils.getSelectedText();

    expect(highligtedText).toEqual('John Johnson');
  });
});

describe('Input Short Field Sizes tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/input/test-short-field-sizes?theme=classic&layout=nofrills');
    await browser.driver.sleep(config.sleep);
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'input-short-fields-sizes')).toEqual(0);
    });
  }
});

describe('Input Short Field tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/input/test-short-fields?theme=classic&layout=nofrills');
    await browser.driver.sleep(config.sleep);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'input-short-fields')).toEqual(0);
    });
  }
});

describe('Input Password Field tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/input/example-password');
    await browser.driver.sleep(config.sleep);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to toggle text visibility with the keyboard', async () => {
    const inputEl = await element(by.id('password-reveal'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(inputEl), config.waitsFor);

    expect(await inputEl.getAttribute('class')).toEqual('input-hide-text');

    await element.all(by.css('.input-hideshow-text')).first().click();

    expect(await inputEl.getAttribute('class')).toEqual('input-show-text');
  });
});

describe('Input example-clearable tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/input/example-clearable?theme=classic&layout=nofrills');
    await browser.driver.sleep(config.sleep);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visual regress', async () => {
      const inputEl = await element(by.id('clearable'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(inputEl), config.waitsFor);

      await inputEl.clear();
      await inputEl.sendKeys('ea');

      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(inputEl, 'clearable-input')).toEqual(0);
    });
  }
});
