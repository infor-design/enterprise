const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Menu button example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/menubutton/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should open on click', async () => {
    await element(by.id('test')).click();
    const popupmenuElem = await element(by.css('ul.popupmenu.is-open'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(popupmenuElem), config.waitsFor);

    expect(await element(by.css('ul.popupmenu.is-open')).isDisplayed()).toBe(true);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      await element(by.id('test')).click();
      const popupmenuElem = await element(by.css('ul.popupmenu.is-open'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(popupmenuElem), config.waitsFor);

      expect(await element(by.css('ul.popupmenu.is-open')).isDisplayed()).toBe(true);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('menu-button')).toEqual(0);
    });
  }
});

describe('Menu button disabled tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/menubutton/test-disabled');
  });

  it('Should be disabled', async () => {
    expect(await element(by.id('test')).getAttribute('class')).not.toContain('is-disabled');
    expect(await element(by.id('test')).getAttribute('disabled')).toBe('true');
  });

  it('Should not open on click', async () => {
    await element(by.id('test')).click();

    expect(await element(by.css('ul#popupmenu-1.popupmenu')).isDisplayed()).toBe(false);
    expect(await element(by.css('ul#popupmenu-2.popupmenu')).isDisplayed()).toBe(false);
  });
});
