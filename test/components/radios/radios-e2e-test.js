const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

const radioId = 'option1';

describe('Radios example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/radios/example-index?theme=classic&layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id(radioId))), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress on example-index', async () => {
      const windowSize = await browser.driver.manage().window().getSize();
      await browser.driver.manage().window().setSize(600, 600);
      const container = await element(by.css('.container'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(container), config.waitsFor);

      expect(await browser.imageComparison.checkElement(container, 'radio-init')).toEqual(0);
      await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
    });
  }
});

describe('Radios Horizontal tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/radios/example-horizontal?theme=classic&layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id(radioId))), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress on example-index', async () => {
      const container = await element(by.css('.container'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(container), config.waitsFor);

      expect(await browser.imageComparison.checkElement(container, 'radio-horizontal')).toEqual(0);
    });
  }
});

describe('Radios validation tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/radios/test-validation');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id(radioId))), config.waitsFor);
  });

  it('Validates on tab', async () => {
    await element.all(by.css('.radio')).first().sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.message-text')).count()).toEqual(1);
  });

  it('Validates on submit', async () => {
    await element.all(by.css('#submit')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.message-text')).count()).toEqual(1);
  });
});
