const AxeBuilder = require('axe-webdriverjs');
const { browserStackErrorReporter } = require('../../../test/helpers/browserstack-error-reporter.js');
const rules = require('../../../test/helpers/axe-rules.js');
require('../../../test/helpers/rejection.js');

const axeOptions = { rules: rules.axeRules };

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Button example-with-icons tests', () => {
  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.driver.get('http://localhost:4000/components/button/example-with-icons');
  });

  if (browser.browserName !== 'safari') {
    it('Should open menu on return', async () => {
      const buttonEl = await element(by.id('menu-button-alone'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);
      await buttonEl.sendKeys(protractor.Key.ENTER);

      expect(await buttonEl.getAttribute('class')).toContain('is-open');

      expect(await element(by.css('button#menu-button-alone[aria-haspopup="true"]')).isDisplayed()).toBe(true);
    });
  }

  it('Should open menu on click', async () => {
    const buttonEl = await element(by.id('menu-button-alone'));
    await buttonEl.click();

    expect(buttonEl.getAttribute('class')).toContain('is-open');

    expect(await element(by.css('button#menu-button-alone[aria-haspopup="true"]')).isDisplayed()).toBe(true);
  });

  if (browser.browserName === 'chrome') {
    it('Should not visual regress', async () => {
      expect(await browser.protractorImageComparison.checkScreen('buttonPage')).toEqual(0);
    });
  }

  // Exclude IE11: Async timeout errors
  if (browser.browserName !== 'ie') {
    it('Should be accessible on init with no WCAG 2AA violations', async () => {
      const buttonEl = await element(by.id('menu-button-alone'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);
      await buttonEl.click();

      const res = await AxeBuilder(browser.driver)
        .configure(axeOptions)
        .exclude('header')
        .analyze();

      expect(res.violations.length).toEqual(0);
    });
  }
});

describe('Button example-toggle-button tests', () => {
  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.driver.get('http://localhost:4000/components/button/example-toggle-button.html');
  });

  it('Should toggle', async () => {
    const buttonEl = await element.all(by.css('.btn-icon.icon-favorite.btn-toggle')).first();
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);
    await buttonEl.click();

    expect(await buttonEl.getAttribute('aria-pressed')).toBe('false');
  });
});
