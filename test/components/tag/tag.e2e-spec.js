const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Tag example-linkable tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tag/example-linkable');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should display caret right icon correctly', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element.all(by.css('.tag-list .is-linkable')).get(0)), config.waitsFor);

    expect(await element.all(by.css('.tag-list .is-linkable')).get(0).isDisplayed()).toBeTruthy();
  });
});
