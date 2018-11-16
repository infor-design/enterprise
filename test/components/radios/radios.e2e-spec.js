const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

// Set page to test by url
const setPage = async function (url) {
  const pageurl = `${browser.baseUrl + url}?theme=${browser.params.theme}`;
  await browser.waitForAngularEnabled(false);
  await browser.driver.get(pageurl);
};

const radioId = 'option1';

describe('Radios example-index tests', () => {
  beforeEach(async () => {
    await setPage('/components/radios/example-index?nofrills=true');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id(radioId))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    fit('Should not visual regress on example-index', async () => {
      const container = await element(by.css('.container'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(container), config.waitsFor);

      expect(await browser.protractorImageComparison.checkElement(container, 'radio-init')).toEqual(0);
    });
  }
});

describe('Radios validation tests', () => {
  beforeEach(async () => {
    await setPage('/components/radios/test-validation');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id(radioId))), config.waitsFor);
  });

  it('Validates and clears validation', async () => {
    await element.all(by.css('.radio')).first().sendKeys(protractor.Key.TAB);
    await browser.switchTo().activeElement().sendKeys(protractor.Key.TAB);
    await browser.switchTo().activeElement().sendKeys(protractor.Key.TAB);
    await browser.driver.sleep(config.waitsFor);

    expect(await element.all(by.css('.message-text')).count()).toEqual(1);

    await element.all(by.css('.radio-label')).get(1).click();
    await browser.driver.sleep(config.waitsFor);

    expect(await element.all(by.css('.message-text')).count()).toEqual(0);
  });
});
