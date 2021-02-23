const { browserStackErrorReporter } = require('./helpers/browserstack-error-reporter.js');
const utils = require('./helpers/e2e-utils.js');
const config = require('./helpers/e2e-config.js');

require('./helpers/rejection.js');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Kitchen-sink tests', () => {
  beforeEach(async () => {
    await utils.setPage('/kitchen-sink');
  });

  if (!utils.isIE()) {
    if (utils.isChrome()) {
      it('Should pass CSP', async () => {
        let errorLog = null;
        await browser.manage().logs().get('browser').then((browserLog) => {
          errorLog = browserLog;
        });

        const securityErrors = errorLog.filter(err => err.level.name === 'SEVERE' && err.message.indexOf('Security') > -1);

        expect(securityErrors.length).toEqual(0);
      });
    }

    it('Should not have errors', async () => {
      await utils.checkForErrors();
    });

    it('Should change themes', async () => {
      const buttonChangerEl = await element(by.css('.page-changer'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonChangerEl), config.waitsFor);
      await buttonChangerEl.click();
      const highContrastItem = await element(by.cssContainingText('.popupmenu.is-open li', 'Versions'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(highContrastItem), config.waitsFor);
      await highContrastItem.click();
      await browser.driver.sleep(config.sleep);

      const newItem = await element(by.cssContainingText('.popupmenu.is-open li a', 'Classic'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(newItem), config.waitsFor);
      await newItem.click();
      await browser.driver.sleep(config.sleep);

      expect(await element(by.css('html')).getAttribute('class')).toContain('theme-classic-light');
    });
  }
});
