const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('LongPress events', () => {
  beforeEach(async () => {
    await utils.setPage('/behaviors/longpress/test-e2e-overlay-toggle');
  });

  // TODO: #425
  // Figure out how to simulate longpress correctly
  // adapted from:
  // - https://qeworks.com/questions/question/custom-browser-actions-in-protractor
  // - https://stackoverflow.com/questions/27300433/protractorangularjsjasmine-test-press-and-hold-item
  xit('can have handlers attached', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('#test-overlay'))), config.waitsFor);

    const titleEl = await element(by.css('#page-title'));
    await browser.driver.actions().mouseDown(titleEl).perform();
    await browser.driver.sleep(301);
    await browser.driver.actions().mouseUp(titleEl).perform();

    expect(await element(by.css('#test-overlay')).getAttribute('class')).toContain('visible');
  });
});
