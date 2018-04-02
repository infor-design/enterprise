const AxeBuilder = require('axe-webdriverjs');
const { browserStackErrorReporter } = require('../../../test/helpers/browserstack-error-reporter.js');

// Light Theme color contrast is not WCAG 2AA, #fff on #368ac0, focused item on a open dropdown
const axeOptions = {
  rules: [
    {
      id: 'aria-allowed-attr',
      enabled: false
    },
    {
      id: 'aria-required-children',
      enabled: false
    },
    {
      id: 'aria-valid-attr-value',
      enabled: false
    },
    {
      id: 'color-contrast',
      enabled: false
    },
    {
      id: 'region',
      enabled: false
    }
  ]
};

jasmine.getEnv().addReporter(browserStackErrorReporter);

const setupButton = async (url, el) => {
  await browser.waitForAngularEnabled(false);
  await browser.driver.get(url);
  const buttonEl = await element.all(by.css(el)).first();
  await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);
  return buttonEl;
};

describe('Button tests', () => {
  if (browser.browserName.toLowerCase() !== 'safari') {
    it('Should open menu on return', async () => {
      await setupButton('http://localhost:4000/components/button/example-with-icons', '#menu-button-alone');
      const buttonEl = await element(by.id('menu-button-alone'));
      await buttonEl.sendKeys(protractor.Key.ENTER);

      expect(await buttonEl.getAttribute('class')).toContain('is-open');

      expect(await element(by.css('button#menu-button-alone[aria-haspopup="true"]')).isDisplayed()).toBe(true);
    });
  }

  it('Should open menu on click', async () => {
    await setupButton('http://localhost:4000/components/button/example-with-icons', '#menu-button-alone');
    const buttonEl = await element(by.id('menu-button-alone'));
    await buttonEl.click();

    expect(buttonEl.getAttribute('class')).toContain('is-open');

    expect(await element(by.css('button#menu-button-alone[aria-haspopup="true"]')).isDisplayed()).toBe(true);
  });

  it('Should toggle', async () => {
    await setupButton('http://localhost:4000/components/button/example-toggle-button.html', '.btn-icon.icon-favorite.btn-toggle');
    const buttonEl = await element.all(by.css('.btn-icon.icon-favorite.btn-toggle')).first();
    await buttonEl.click();

    expect(await buttonEl.getAttribute('aria-pressed')).toBe('false');
  });

  if (browser.browserName.toLowerCase() === 'chrome') {
    it('Should not visual regress', async () => {
      await setupButton('http://localhost:4000/components/button/example-with-icons', '#menu-button-alone');

      expect(await browser.protractorImageComparison.checkScreen('buttonPage')).toEqual(0);
    });
  }

  // Disable IE11: Async timeout errors
  if (browser.browserName.toLowerCase() !== 'ie') {
    it('Should be accessible on init with no WCAG 2AA violations', async () => {
      await setupButton('http://localhost:4000/components/button/example-with-icons', '#menu-button-alone');
      const buttonEl = await element(by.id('menu-button-alone'));
      await buttonEl.click();

      const res = await AxeBuilder(browser.driver)
        .configure(axeOptions)
        .exclude('header')
        .analyze();

      expect(res.violations.length).toEqual(0);
    });
  }
});
