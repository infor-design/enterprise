const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Toolbar (overflow)', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs-module/example-category-searchfield-go-button-home.html');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id('module-tab-panel-container'))), config.waitsFor);
  });

  it('should not have any errors', async () => {
    await utils.checkForErrors();
  });

  it('will not force buttons to remain in overflow', async () => {
    // Store the original window size
    const windowSize = await browser.driver.manage().window().getSize();

    // Shrink the window to be absurdly small, and allow time for the calculation to occur
    await browser.driver.manage().window().setSize(320, 480);
    await browser.driver.sleep(config.sleepLonger);

    // Put the window size back, allowing time for recalculation
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
    await browser.driver.sleep(config.sleepLonger);

    // Check the Home button, and make sure it's not overflowed
    expect(await element(by.id('home-button')).getAttribute('class')).not.toContain('is-overflowed');
  });
});
