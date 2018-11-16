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

const inputId = 'first-name';

describe('Input example-index tests', () => {
  beforeEach(async () => {
    await setPage('/components/input/example-index?nofrills=true');
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
