const AxeBuilder = require('axe-webdriverjs');
const { browserStackErrorReporter } = require('./helpers/browserstack-error-reporter.js');
const utils = require('./helpers/e2e-utils.js');
const rules = require('./helpers/default-axe-options.js');
const config = require('./helpers/e2e-config.js');
require('./helpers/rejection.js');

const axeOptions = { rules };

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Kitchen-sink tests', () => {
  // Exclude IE11: Async timeout errors
  if (!utils.isIE()) {
    it('Should be accessible on init with no WCAG 2AA violations on light theme', async () => {
      await browser.waitForAngularEnabled(false);
      await browser.driver.get('http://localhost:4000/kitchen-sink');

      const res = await AxeBuilder(browser.driver)
        .configure(axeOptions)
        .exclude('header')
        .analyze();

      expect(res.violations.length).toEqual(0);
    });

    it('Should be accessible on init with no WCAG 2AA violations on high contrast theme', async () => {
      await browser.waitForAngularEnabled(false);
      await browser.driver.get('http://localhost:4000/kitchen-sink?theme=high-contrast');

      const res = await AxeBuilder(browser.driver)
        .configure(axeOptions)
        .exclude('header')
        .analyze();

      expect(res.violations.length).toEqual(0);
    });

    it('Should be accessible on init with no WCAG 2AA violations on dark theme', async () => {
      await browser.waitForAngularEnabled(false);
      await browser.driver.get('http://localhost:4000/kitchen-sink?theme=dark');

      const res = await AxeBuilder(browser.driver)
        .configure(axeOptions)
        .exclude('header')
        .analyze();

      expect(res.violations.length).toEqual(0);
    });

    it('Should pass CSP', async () => {
      await browser.waitForAngularEnabled(false);
      await browser.driver.get('http://localhost:4000/kitchen-sink');

      let errorLog = null;
      await browser.manage().logs().get('browser').then((browserLog) => {
        errorLog = browserLog;
      });

      const securityErrors = errorLog.filter(err => err.level.name === 'SEVERE' && err.message.indexOf('Security') > -1);

      expect(securityErrors.length).toEqual(0);
    });

    it('Should change themes', async () => {
      const buttonChangerEl = await element(by.css('.page-changer'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonChangerEl), config.waitsFor);
      await buttonChangerEl.click();
      const highContrastItem = await element.all(by.css('.popupmenu.is-open li')).get(3);
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(highContrastItem), config.waitsFor);
      await highContrastItem.click();
      await browser.driver.sleep(config.sleep);

      expect(await element(by.css('html')).getAttribute('class')).toContain('high-contrast-theme');
    });
  }
});
