const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Colorpicker example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/colorpicker/example-index');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on example-index', async () => {
      await browser.driver.sleep(config.sleep);
      const colorpickerSection = await element(by.id('maincontent'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(colorpickerSection), config.waitsFor);
      const colorpickerContainer = await element.all(by.className('colorpicker-container')).first();

      expect(await browser.imageComparison.checkElement(colorpickerContainer, 'colorpicker-init')).toEqual(0);
      await element(by.css('#background-color + .trigger .icon')).click();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(colorpickerSection, 'colorpicker-open')).toEqual(0);
    });
  }

  it('Should open popup on icon click', async () => {
    await element(by.css('#background-color + .trigger .icon')).click();

    expect(await element(by.css('#background-color.is-open')).isDisplayed()).toBe(true);
  });

  it('Should open popup on keyboard down', async () => {
    const colorInputEl = await element(by.css('#background-color'));
    await colorInputEl.click();
    await colorInputEl.sendKeys(protractor.Key.ARROW_DOWN);

    expect(await element(by.css('#background-color.is-open')).isDisplayed()).toBe(true);
  });

  it('Should pick color from picker', async () => {
    await element(by.css('#background-color + .trigger .icon')).click();
    await element(by.css('#colorpicker-menu li:first-child a:first-child')).click();

    expect(await element(by.id('background-color')).getAttribute('value')).toEqual('#1A1A1A');
  });

  it('Should pick color from picker on keyboard enter', async () => {
    const colorInputEl = await element(by.id('background-color'));
    await colorInputEl.click();
    await colorInputEl.sendKeys(protractor.Key.ARROW_DOWN);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.id('colorpicker-menu'))), config.waitsFor);
    await browser.driver.actions().sendKeys(protractor.Key.ARROW_UP).perform();
    await browser.driver.actions().sendKeys(protractor.Key.ARROW_UP).perform();
    await browser.driver.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
    await browser.driver.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
    await browser.driver.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
    await browser.driver.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
    await browser.driver.actions().sendKeys(protractor.Key.ENTER).perform();

    expect(await element(by.id('background-color')).getAttribute('value')).toEqual('#1A1A1A');
  });

  it('Should set color from manual entry of #898989', async () => {
    const colorInputEl = await element(by.id('background-color'));
    await colorInputEl.click();
    await colorInputEl.clear();
    await colorInputEl.sendKeys('898989');
    await colorInputEl.sendKeys(protractor.Key.ENTER);

    expect(await element(by.id('background-color')).getAttribute('value')).toEqual('#898989');
    expect(await element.all(by.className('swatch')).first().getAttribute('style')).toBe('background-color: rgb(137, 137, 137);');
  });

  it('Should pick clear color from picker', async () => {
    await element(by.css('#background-color + .trigger .icon')).click();
    await element(by.css('#colorpicker-menu li:last-child a:first-child')).click();

    expect(await element(by.id('background-color')).getAttribute('value')).toEqual('');
    expect(await element(by.css('.swatch.is-invalid')).isDisplayed()).toBe(true);
  });

  it('Should open popup on keypress(arrow-down)', async () => {
    await element(by.id('background-color')).sendKeys(protractor.Key.ARROW_DOWN);

    expect(await element(by.css('#background-color.is-open')).isDisplayed()).toBe(true);
  });

  it('Should pick color from picker with keypress', async () => {
    await element(by.id('background-color')).sendKeys(protractor.Key.ARROW_DOWN);

    expect(await element(by.css('#background-color.is-open')).isDisplayed()).toBe(true);

    await element(by.css('#colorpicker-menu li:first-child a:first-child')).sendKeys(protractor.Key.SPACE);

    expect(await element(by.id('background-color')).getAttribute('value')).toEqual('#1A1A1A');
  });

  it('Should pick clear color from picker with keypress', async () => {
    await element(by.id('background-color')).sendKeys(protractor.Key.ARROW_DOWN);

    expect(await element(by.css('#background-color.is-open')).isDisplayed()).toBe(true);

    await element(by.css('#colorpicker-menu li:last-child a:first-child')).sendKeys(protractor.Key.SPACE);
    await element(by.id('background-color')).sendKeys(protractor.Key.TAB);

    expect(await element(by.id('background-color')).getAttribute('value')).toEqual('');
    expect(await element(by.css('.swatch.is-invalid')).isDisplayed()).toBe(true);
  });

  it('Should set clear swatch', async () => {
    await element(by.id('background-color')).sendKeys(protractor.Key.BACK_SPACE);
    await element(by.css('body')).click();

    expect(await element(by.id('background-color')).getAttribute('value')).toEqual('#B94E4');
    expect(await element(by.css('.swatch.is-invalid')).isDisplayed()).toBe(true);
  });
});

describe('Colorpicker show label tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/colorpicker/example-show-label');
  });

  it('Should pick color from picker and set label', async () => {
    await element(by.css('#show-label + .trigger .icon')).click();
    await element(by.css('#colorpicker-menu li:first-child a:first-child')).click();

    expect(await element(by.id('show-label')).getAttribute('value')).toEqual('Slate10');
  });

  it('Should pick clear color from picker and set label', async () => {
    await element(by.css('#show-label + .trigger .icon')).click();
    await element(by.css('#colorpicker-menu li:last-child a:first-child')).click();

    expect(await element(by.id('show-label')).getAttribute('value')).toEqual('None');
  });
});

describe('Colorpicker custom label tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/colorpicker/example-custom-labels');
  });

  it('Should pick color from picker as custom color and label', async () => {
    await element(by.css('#custom-color + .trigger .icon')).click();
    await element(by.css('#colorpicker-menu li:first-child a:first-child')).click();

    expect(await element(by.id('custom-color')).getAttribute('value')).toEqual('#2578a9');

    await element(by.css('#custom-label + .trigger .icon')).click();
    await element(by.css('#colorpicker-menu li:first-child a:first-child')).click();

    expect(await element(by.id('custom-label')).getAttribute('value')).toEqual('Grape10');
  });
});

describe('Colorpicker case types tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/colorpicker/test-case-types');
  });

  it('Should pick color from picker and use upper case', async () => {
    await element(by.css('#colorpicker-uc + .trigger .icon')).click();
    await element(by.css('#colorpicker-menu li:first-child a:first-child')).click();

    expect(await element(by.id('colorpicker-uc')).getAttribute('value')).toEqual('#1A1A1A');
  });

  it('Should pick color from picker and use lower case', async () => {
    await element(by.css('#colorpicker-lc + .trigger .icon')).click();
    await element(by.css('#colorpicker-menu li:first-child a:first-child')).click();

    expect(await element(by.id('colorpicker-lc')).getAttribute('value')).toEqual('#1a1a1a');
  });
});

describe('Colorpicker clearable tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/colorpicker/test-clearable');
  });

  it('Should show clearable option', async () => {
    await element.all(by.css('#cp-clearable-true + .trigger .icon')).first().click();

    expect(await element(by.css('#colorpicker-menu li:last-child .swatch')).getAttribute('class')).toContain('is-empty');
  });

  it('Should not show clearable option', async () => {
    await element(by.css('#cp-clearable-false + .trigger .icon')).click();

    expect(await element(by.css('#colorpicker-menu li:last-child .swatch')).getAttribute('class')).not.toContain('is-empty');
  });
});

describe('Colorpicker states tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/colorpicker/test-states');
  });

  it('Should check for state Non-Editable', async () => {
    await element(by.css('#non-editable + .trigger .icon')).click();
    await element(by.css('#colorpicker-menu li:first-child a:first-child')).click();

    expect(await element(by.id('non-editable')).getAttribute('value')).toEqual('#1A1A1A');

    await element(by.id('non-editable')).sendKeys(protractor.Key.BACK_SPACE);
    await element(by.css('body')).click();

    expect(await element(by.id('non-editable')).getAttribute('value')).toEqual('#1A1A1A');
  });

  it('Should check for state Disabled', async () => {
    await element(by.css('#foreground-color + .trigger .icon')).click();

    expect(await element(by.css('#foreground-color.is-open')).isPresent()).toBe(false);
    expect(await element(by.css('#foreground-color')).isEnabled()).toBeFalsy();
  });

  it('Should check for state Readonly', async () => {
    await element(by.css('#readonly-color + .trigger .icon')).click();

    expect(await element(by.css('#readonly-color.is-open')).isPresent()).toBe(false);
    expect(await element(by.css('#readonly-color[readonly]')).isDisplayed()).toBe(true);
  });

  if (!utils.isCI() && !utils.isBS()) {
    it('Should check for Dirty Tracking', async () => {
      await element(by.css('#dirty-color + .trigger .icon')).click();
      await element.all(by.css('#colorpicker-menu li:first-child a:first-child')).first().click();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.icon-dirty'))), config.waitsFor);

      expect(await element(by.css('.icon-dirty')).isPresent()).toBe(true);

      await element(by.css('#dirty-color + .trigger .icon')).click();
      await element(by.css('#colorpicker-menu li:last-child a:first-child')).click();
      await browser.driver
        .wait(protractor.ExpectedConditions.stalenessOf(await element(by.css('.icon-dirty'))), config.waitsFor);

      expect(await element(by.css('.icon-dirty')).isPresent()).toBe(false);
    });
  }

  it('Should check for Validation required rule', async () => {
    const colorpickerEl = await element(by.id('required-color'));
    await colorpickerEl.clear();

    expect(await colorpickerEl.getAttribute('value')).toEqual('');

    await colorpickerEl.sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.message-text')).getText()).toBe('Required');
    expect(await element(by.css('.icon-error')).isPresent()).toBe(true);
    expect(await colorpickerEl.getAttribute('class')).toContain('error');
  });

  it('Should check for api option Just Color', async () => {
    expect(await element(by.id('color-only')).getCssValue('width')).toBe('10px');
  });
});

describe('Colorpicker modal tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/colorpicker/test-modal');
  });

  it('Should open colorpicker modal', async () => {
    const modalBtnEl = await element(by.id('add-comment'));
    await modalBtnEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.className('modal-page-container'))), config.waitsFor);

    expect(await element(by.className('modal-engaged')).isPresent()).toBe(true);
  });

  it('Should select color, and close colorpicker modal on "cancel" button click', async () => {
    const modalBtnEl = await element(by.id('add-comment'));
    await modalBtnEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.className('modal'))), config.waitsFor);

    expect(await element(by.className('modal-engaged')).isPresent()).toBe(true);
    await element(by.css('#color1 + .trigger .icon')).click();
    await element(by.css('#colorpicker-menu li:first-child a:first-child')).click();

    expect(await element(by.id('color1')).getAttribute('value')).toEqual('#1A1A1A');
    await element(by.id('modal-button-1')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.invisibilityOf(await element(by.css('.modal-page-container .overlay'))), config.waitsFor);

    expect(await element(by.className('modal-engaged')).isPresent()).toBe(false);
  });

  it('Should select color, and close colorpicker modal on "save" button click', async () => {
    const modalBtnEl = await element(by.id('add-comment'));
    await modalBtnEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.className('modal'))), config.waitsFor);

    expect(await element(by.className('modal-engaged')).isPresent()).toBe(true);
    await element(by.css('#color1 + .trigger .icon')).click();
    await element(by.css('#colorpicker-menu li:first-child a:first-child')).click();

    expect(await element(by.id('color1')).getAttribute('value')).toEqual('#1A1A1A');
    await element(by.id('modal-button-2')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.invisibilityOf(await element(by.css('.modal-page-container .overlay'))), config.waitsFor);

    expect(await element(by.className('modal-engaged')).isPresent()).toBe(false);
  });

  it('Should select from both colorpickers, and close colorpicker modal on "save" button click', async () => {
    const modalBtnEl = await element(by.id('add-comment'));
    await modalBtnEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.className('modal'))), config.waitsFor);

    expect(await element(by.className('modal-engaged')).isPresent()).toBe(true);
    await element(by.css('#color1 + .trigger .icon')).click();
    await element(by.css('#colorpicker-menu li:first-child a:first-child')).click();

    expect(await element(by.id('color1')).getAttribute('value')).toEqual('#1A1A1A');
    await element(by.css('#color2 + .trigger .icon')).click();
    await element(by.css('#colorpicker-menu li:first-child a:first-child')).click();

    expect(await element(by.id('color2')).getAttribute('value')).toEqual('#1A1A1A');
    await element(by.id('modal-button-2')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.invisibilityOf(await element(by.className('modal'))), config.waitsFor);

    expect(await element(by.className('modal-engaged')).isPresent()).toBe(false);
  });

  it('Should close colorpicker modal on keypress escape', async () => {
    const modalBtnEl = await element(by.id('add-comment'));
    await modalBtnEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.className('modal'))), config.waitsFor);

    expect(await element(by.className('modal-engaged')).isPresent()).toBe(true);
    await browser.driver.sleep(config.sleep);
    await browser.driver.actions().sendKeys(protractor.Key.ESCAPE).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.invisibilityOf(await element(by.className('modal'))), config.waitsFor);

    expect(await element(by.className('modal-engaged')).isPresent()).toBe(false);
  });

  it('Should tab to, and open second colorpicker, tab out, and press enter on cancel to close', async () => {
    const modalBtnEl = await element(by.id('add-comment'));
    await modalBtnEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.className('modal'))), config.waitsFor);

    expect(await element(by.className('modal-engaged')).isPresent()).toBe(true);
    await browser.driver.sleep(config.sleepLonger);
    await browser.driver.actions().sendKeys(protractor.Key.TAB).perform();
    await browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
    await browser.driver.sleep(config.sleepLonger);
    await browser.driver.actions().sendKeys(protractor.Key.ENTER).perform();

    expect(await element(by.id('color2')).getAttribute('value')).toEqual('#1A1A1A');

    await browser.driver.sleep(config.sleepLonger);
    await browser.driver.actions().sendKeys(protractor.Key.TAB).perform();
    await browser.driver.actions().sendKeys(protractor.Key.ENTER).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.invisibilityOf(await element(by.className('modal'))), config.waitsFor);

    expect(await element(by.className('modal-engaged')).isPresent()).toBe(false);
  });

  it('Should tab to, and enter hex, and press enter, display value, and close modal', async () => {
    const modalBtnEl = await element(by.id('add-comment'));
    await modalBtnEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.className('modal'))), config.waitsFor);

    expect(await element(by.className('modal-engaged')).isPresent()).toBe(true);
    await browser.driver.sleep(config.sleep);
    await browser.driver.actions().sendKeys(protractor.Key.TAB).perform();
    await browser.driver.sleep(config.sleep);
    await browser.driver.actions().sendKeys('1a1a1a').perform();
    await browser.driver.actions().sendKeys(protractor.Key.ENTER).perform();

    expect(await element(by.id('color2')).getAttribute('value')).toEqual('#1A1A1A');
    expect(await element(by.className('modal-engaged')).isPresent()).toBe(true);
  });
});

describe('Colorpicker sizes tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/colorpicker/example-sizes?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('colorpicker-sizes')).toEqual(0);
    });
  }
});

describe('Colorpicker RTL left and right keys test', () => {
  beforeEach(async () => {
    await utils.setPage('/components/colorpicker/example-index?locale=ar-EG&layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should pick correct color from picker on keyboard enter', async () => {
    const colorInputEl = await element(by.id('background-color'));
    await colorInputEl.click();
    await colorInputEl.sendKeys(protractor.Key.ARROW_DOWN);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.id('colorpicker-menu'))), config.waitsFor);
    await browser.driver.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();
    await browser.driver.actions().sendKeys(protractor.Key.ENTER).perform();

    expect(await element(by.id('background-color')).getAttribute('value')).toEqual('#AD4242');
  });
});
