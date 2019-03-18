const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Hierarchy stacked layout', () => {
  beforeEach(async () => {
    await utils.setPage('/components/hierarchy/example-stacked?layout=nofrills');
  });

  it('Should Render', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.id('hierarchy'))), config.waitsFor);

    expect(await element(by.id('hierarchy')).isDisplayed()).toBeTruthy();
    expect(await element.all(by.css('.leaf')).count()).toEqual(3);
  });

  it('Should render legend', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.id('hierarchy'))), config.waitsFor);

    expect(await element(by.tagName('legend')).isDisplayed()).toBeTruthy();
  });

  it('Should load next set of records', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.id('hierarchy'))), config.waitsFor);

    await element.all(by.css('.btn')).get(2).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.leaf')).count()).toEqual(5);

    await element.all(by.css('.btn')).get(4).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.leaf')).count()).toEqual(5);
    expect(await element.all(by.css('.ancestor')).count()).toEqual(3);
  });

  it('Should go back to the initial page', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.id('hierarchy'))), config.waitsFor);

    // Load children
    await element.all(by.css('.btn')).get(2).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.leaf')).count()).toEqual(5);

    // Go back
    await element.all(by.css('.btn')).get(0).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.leaf')).count()).toEqual(3);
    expect(await element.all(by.css('.btn-collapse')).count()).toEqual(3);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });
});
