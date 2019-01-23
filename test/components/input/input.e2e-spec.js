const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

const inputId = 'first-name';

describe('Input example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/input/example-index?layout=nofrills');
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

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'input-index')).toEqual(0);
    });
  }
});

describe('Input tooltip tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/input/test-tooltips?layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id('first-name'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
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
