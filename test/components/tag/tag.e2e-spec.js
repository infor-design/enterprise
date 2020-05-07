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

if (utils.isChrome() && utils.isCI()) {
  describe('Tag visual regression tests', () => {
    it('standard tags should not change', async () => {
      await utils.setPage('/components/tag/example-index');
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(await element.all(by.css('.tag-list')).get(0)), config.waitsFor);
      const tagEl = await element.all(by.css('.tag-list .tag:first-child')).first();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(tagEl, 'tag-standard')).toEqual(0);
    });

    it('linkable tags should not change', async () => {
      await utils.setPage('/components/tag/example-linkable');
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(await element.all(by.css('.tag-list')).get(0)), config.waitsFor);
      const tagEl = await element.all(by.css('.tag-list .tag:first-child')).first();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(tagEl, 'tag-linkable')).toEqual(0);
    });

    it('dismissible and linkable tags should not change', async () => {
      await utils.setPage('/components/tag/example-dismissible-and-clickable');
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.tag-list'))), config.waitsFor);
      const tagEl = await element(by.css('.tag-list .tag:first-child'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(tagEl, 'tag-dismissible-clickable')).toEqual(0);
    });

    it('disabled tags should not change', async () => {
      await utils.setPage('/components/tag/example-disabled');
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.tag-list'))), config.waitsFor);
      const tagEl = await element.all(by.css('.tag-list .tag:first-child')).first();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(tagEl, 'tag-disabled')).toEqual(0);
    });
  });
}
