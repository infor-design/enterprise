const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = require('../../helpers/e2e-config.js');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Textarea example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/textarea/example-index');
  });

  it('Should block input on disabled', async () => {
    const textareaEl = await element(by.id('description-disabled'));

    expect(await textareaEl.isEnabled()).toBe(false);
  });

  it('Should block input on readonly', async () => {
    const textareaEl = await element(by.id('description-readonly'));

    expect(await textareaEl.getAttribute('readonly')).toBe('true');
  });

  it('Should maintain counts', async () => {
    await element(by.id('description-max')).sendKeys('This is a test');

    expect(await element(by.css('#description-max + span')).getText()).toBe('This is a test');
  });
});

describe('Textarea size tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/textarea/example-sizes');
  });

  it('Should support check sizes', async () => {
    const smEl = await element(by.id('sm-textarea-example'));

    expect(await smEl.getCssValue('width')).toBe('150px');

    const mdEl = await element(by.id('def-textarea-example'));

    expect(await mdEl.getCssValue('width')).toBe('362px');

    const lgEl = await element(by.id('lg-textarea-example'));

    expect(await lgEl.getCssValue('width')).toBe('400px');

    const responsiveEl = await element(by.id('responsive'));

    expect(await responsiveEl.getCssValue('width')).toBe('1160px');
  });
});

describe('Textarea auto grow tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/textarea/example-autogrow');
  });

  it('Should support autogrow', async () => {
    const textareaEl = await element(by.id('autogrow'));
    await textareaEl.sendKeys('Test');
    await textareaEl.sendKeys(protractor.Key.ENTER);
    await textareaEl.sendKeys('Test');
    await textareaEl.sendKeys(protractor.Key.ENTER);
    await textareaEl.sendKeys('Test');
    await textareaEl.sendKeys(protractor.Key.ENTER);
    await textareaEl.sendKeys('Test');
    await textareaEl.sendKeys(protractor.Key.ENTER);
    await textareaEl.sendKeys('Test');
    await textareaEl.sendKeys(protractor.Key.ENTER);
    await textareaEl.sendKeys('Test');
    await textareaEl.sendKeys(protractor.Key.ENTER);
    await textareaEl.sendKeys('Test');
    await textareaEl.sendKeys(protractor.Key.ENTER);

    await browser.driver.sleep(config.sleep);
    const h = parseInt(await textareaEl.getCssValue('height'), 10);

    // Allowing for browser diffs but should grow around to 180
    expect(h).toBeGreaterThan(175);
    expect(h).toBeLessThan(185);
  });
});

fdescribe('Textarea Modal Tests', () => { //eslint-disable-line
  beforeEach(async () => {
    await utils.setPage('/components/textarea/test-modal');
  });

  it('Should not close a modal when hitting enter', async () => {
    const modalButton = await element(by.id('button-1'));
    modalButton.click();
    await browser.driver.sleep(config.sleep);

    const textareaEl = await element(by.id('context-desc'));
    await textareaEl.sendKeys('Test');
    await textareaEl.sendKeys(protractor.Key.ENTER);
    await textareaEl.sendKeys('Test');
    await textareaEl.sendKeys(protractor.Key.ENTER);

    debugger;
    expect(await textareaEl.getText()).toBe('Test/nTest/n');
    expect(await element(by.id('modal-1')).isDisplayed()).toBeTruthy();
  });
});
