const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

const clickOnFieldFilter = async (id) => {
  const ddStr = 'div.dropdown';
  const triggerEl = element(by.css(id)).element(by.xpath('..')).element(by.css(ddStr));
  await browser.driver.wait(protractor.ExpectedConditions.presenceOf(triggerEl), config.waitsFor);
  await triggerEl.click();
};

describe('FieldFilter example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/field-filter/example-index');
    await browser.driver.sleep(config.sleep);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should open fieldfilter list on click', async () => {
    await clickOnFieldFilter('#example-textfield');

    expect(await element(by.css('#example-textfield')).element(by.xpath('..')).element(by.className('is-open')).isDisplayed()).toBe(true);
  });

  it('Should be able to select next element', async () => {
    const ddStr = 'div.dropdown';
    const triggerEl = element(by.css('#example-textfield')).element(by.xpath('..')).element(by.css(ddStr));

    await triggerEl.sendKeys(protractor.Key.ARROW_DOWN);

    const ddList = await element(by.css('#dropdown-list'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(ddList), config.waitsFor);

    await browser.switchTo().activeElement().sendKeys(protractor.Key.ARROW_DOWN);
    await browser.switchTo().activeElement().sendKeys(protractor.Key.ENTER);
    await browser.switchTo().activeElement().sendKeys(protractor.Key.TAB);

    expect(await element(by.id('example-textfield-ff')).getAttribute('value')).toEqual('does-not-equal');
  });

  it('Should not contain search element', async () => {
    await clickOnFieldFilter('#example-textfield');
    const ddList = await element(by.css('#dropdown-list'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(ddList), config.waitsFor);

    expect(await element(by.css('#example-textfield')).element(by.xpath('..')).element(by.className('is-open')).isDisplayed()).toBe(true);
    expect(await element(by.css('#example-textfield')).element(by.xpath('..')).element(by.css('#dropdown-search')).isPresent()).toBe(false);
  });

  it('Should be able to set id/automation id', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('custom-id-field-filter')).getAttribute('id')).toEqual('custom-id-field-filter');
    expect(await element(by.id('custom-id-field-filter')).getAttribute('data-automation-id')).toEqual('custom-automation-id-field-filter');
    expect(await element(by.id('custom-id-field-filter-label')).getAttribute('id')).toEqual('custom-id-field-filter-label');
    expect(await element(by.id('custom-id-field-filter-label')).getAttribute('data-automation-id')).toEqual('custom-automation-id-field-filter-label');
    expect(await element(by.id('custom-id-field-filter-input')).getAttribute('id')).toEqual('custom-id-field-filter-input');
    expect(await element(by.id('custom-id-field-filter-input')).getAttribute('data-automation-id')).toEqual('custom-automation-id-field-filter-input');
    expect(await element(by.id('custom-id-field-filter-trigger')).getAttribute('id')).toEqual('custom-id-field-filter-trigger');
    expect(await element(by.id('custom-id-field-filter-trigger')).getAttribute('data-automation-id')).toEqual('custom-automation-id-field-filter-trigger');
    expect(await element(by.id('custom-id-field-filter-listbox')).getAttribute('id')).toEqual('custom-id-field-filter-listbox');
    expect(await element(by.id('custom-id-field-filter-listbox')).getAttribute('data-automation-id')).toEqual('custom-automation-id-field-filter-listbox');
  });
});

describe('FieldFilter filter type tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/field-filter/example-filtertype');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.output'))), config.waitsFor);
  });

  it('Should open fieldfilter on click', async () => {
    await clickOnFieldFilter('#filterable');

    expect(await element(by.css('#filterable')).element(by.xpath('..')).element(by.className('is-open')).isDisplayed()).toBe(true);
  });

  it('Should be able to get current filter type', async () => {
    expect(await element(by.className('output')).getText()).toEqual('Equals');
    const ddStr = 'div.dropdown';
    const triggerEl = element(by.css('#filterable')).element(by.xpath('..')).element(by.css(ddStr));

    await triggerEl.sendKeys(protractor.Key.ARROW_DOWN);

    const ddList = await element(by.css('#dropdown-list'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(ddList), config.waitsFor);

    await browser.switchTo().activeElement().sendKeys(protractor.Key.ARROW_DOWN);
    await browser.switchTo().activeElement().sendKeys(protractor.Key.ENTER);
    await browser.switchTo().activeElement().sendKeys(protractor.Key.TAB);
    await element(by.id('btn-get')).click();

    expect(await element(by.className('output')).getText()).toEqual('Does Not Equal');
  });

  it('Should be able to set filter type programmatically by string value', async () => {
    expect(await element(by.className('output')).getText()).toEqual('Equals');
    await element(by.id('btn-set-by-value')).click();
    const popupmenu = await element(by.id('popupmenu-by-value'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(popupmenu), config.waitsFor);

    await browser.switchTo().activeElement().sendKeys(protractor.Key.ARROW_DOWN);
    await browser.switchTo().activeElement().sendKeys(protractor.Key.ARROW_DOWN);
    await browser.switchTo().activeElement().sendKeys(protractor.Key.ENTER);
    await element(by.id('btn-get')).click();

    expect(await element(by.className('output')).getText()).toEqual('Does Not Equal');
  });

  it('Should be able to set filter type programmatically by index', async () => {
    expect(await element(by.className('output')).getText()).toEqual('Equals');
    await element(by.id('btn-set-by-index')).click();
    const popupmenu = await element(by.id('popupmenu-by-index'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(popupmenu), config.waitsFor);

    await browser.switchTo().activeElement().sendKeys(protractor.Key.ARROW_DOWN);
    await browser.switchTo().activeElement().sendKeys(protractor.Key.ENTER);
    await element(by.id('btn-get')).click();

    expect(await element(by.className('output')).getText()).toEqual('In Range');
  });
});
