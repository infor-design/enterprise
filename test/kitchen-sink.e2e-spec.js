const { browserStackErrorReporter } = require('./helpers/browserstack-error-reporter.js');
const utils = require('./helpers/e2e-utils.js');
const config = require('./helpers/e2e-config.js');
const axePageObjects = require('./helpers/axe-page-objects.js');

require('./helpers/rejection.js');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Kitchen-sink tests', () => {
  beforeEach(async () => {
    await utils.setPage('/kitchen-sink');
  });

  if (!utils.isIE()) {
    xit('Should be accessible on init with no WCAG 2AA violations', async () => {
      const res = await axePageObjects(browser.params.theme);

      expect(res.violations.length).toEqual(0);
    });

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
      const highContrastItem = await element(by.cssContainingText('.popupmenu.is-open li', 'High Contrast'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(highContrastItem), config.waitsFor);
      await highContrastItem.click();
      await browser.driver.sleep(config.sleep);

      expect(await element(by.css('html')).getAttribute('class')).toContain('high-contrast-theme');
    });
  }
});
