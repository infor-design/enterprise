const AxeBuilder = require('axe-webdriverjs');

const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const rules = requireHelper('default-axe-options');
const config = requireHelper('e2e-config');
requireHelper('rejection');
const axeOptions = { rules };

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Button example-index tests', () => {
  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.driver.get(`${browser.baseUrl}/components/button/example-index.html?theme=${browser.params.theme}`);
  });

  if (!utils.isSafari() && !utils.isIE()) {
    if (utils.isChrome() && browser.params.theme === 'light') {
      it('Should mouseover "Primary Button", and change background-color', async () => {
        const buttonEl = await element.all(by.css('.btn-primary')).get(3);
        await browser.driver
          .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
        await browser.driver.actions().mouseMove(buttonEl).perform();
        await browser.driver.sleep(config.sleep);
        // Value returned will be as the browser interprets it, tricky to form a proper assertion
        expect(await buttonEl.getCssValue('background-color')).toBe('rgba(37, 120, 169, 1)');
      });
    }

    it('Should tab to "Primary Button", and animate on enter', async () => {
      const buttonEl = await element.all(by.css('.btn-primary')).get(3);
      const svgEl = await element.all(by.css('.btn-primary')).get(3).element(by.css('.ripple-effect'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await buttonEl.sendKeys(protractor.Key.ENTER);
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(svgEl), config.waitsFor);

      expect(await svgEl.getAttribute('class')).toContain('ripple-effect');
    });

    it('Should click on "Primary Button", and animate on click', async () => {
      const buttonEl = await element.all(by.css('.btn-primary')).get(3);
      const svgEl = await element.all(by.css('.btn-primary')).get(3).element(by.css('.ripple-effect'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
      await buttonEl.click();
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(svgEl), config.waitsFor);

      expect(await svgEl.getAttribute('class')).toContain('ripple-effect');
    });

    it('Should click on "Disabled Primary Button", and not animate', async () => {
      const buttonEl = await element.all(by.css('.btn-primary')).get(2);
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
      await buttonEl.click();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);

      expect(await buttonEl.isElementPresent(by.tagName('svg'))).toBeFalsy();
      expect(await buttonEl.isEnabled()).toBeFalsy();
    });

    it('Should tab to "Secondary Button", and animate on enter', async () => {
      const buttonEl = await element.all(by.css('.btn-secondary')).first();
      const svgEl = await element.all(by.css('.btn-secondary')).first().element(by.css('.ripple-effect'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await buttonEl.sendKeys(protractor.Key.ENTER);
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(svgEl), config.waitsFor);

      expect(await svgEl.getAttribute('class')).toContain('ripple-effect');
    });

    it('Should click on "Disabled Secondary Button", and not animate', async () => {
      const buttonEl = await element.all(by.css('.btn-secondary')).get(1);
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
      await buttonEl.click();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);

      expect(await buttonEl.isElementPresent(by.tagName('svg'))).toBeFalsy();
      expect(await buttonEl.isEnabled()).toBeFalsy();
    });

    it('Should click on "Secondary Button", and animate on click', async () => {
      const buttonEl = await element.all(by.css('.btn-secondary')).first();
      const svgEl = await element.all(by.css('.btn-secondary')).first().element(by.css('.ripple-effect'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
      await buttonEl.click();

      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(svgEl), config.waitsFor);

      expect(await svgEl.getAttribute('class')).toContain('ripple-effect');
    });

    it('Should tab to "Tertiary Button", and animate on enter', async () => {
      const buttonEl = await element.all(by.css('.btn-tertiary')).first();
      const svgEl = await element.all(by.css('.btn-tertiary')).first().element(by.css('.ripple-effect'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await buttonEl.sendKeys(protractor.Key.ENTER);
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(svgEl), config.waitsFor);

      expect(await svgEl.getAttribute('class')).toContain('ripple-effect');
    });

    it('Should click on "Disabled Tertiary Button", and not animate', async () => {
      const buttonEl = await element.all(by.css('.btn-tertiary')).get(1);
      const svgEl = await element.all(by.css('.btn-tertiary')).get(1).element(by.css('.icon'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
      await buttonEl.click();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);

      expect(await svgEl.getAttribute('class')).not.toContain('ripple-effect');
      expect(await buttonEl.isElementPresent(by.tagName('svg'))).toBeTruthy();
      expect(await buttonEl.isEnabled()).toBeFalsy();
    });

    it('Should click on "Tertiary Button", and animate on click', async () => {
      const buttonEl = await element.all(by.css('.btn-tertiary')).first();
      const svgEl = await element.all(by.css('.btn-tertiary')).first().element(by.css('.ripple-effect'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
      await buttonEl.click();

      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(svgEl), config.waitsFor);

      expect(await svgEl.getAttribute('class')).toContain('ripple-effect');
    });

    it('Should tab to "Icon Button", and animate on enter', async () => {
      const buttonEl = await element.all(by.css('#maincontent .btn-icon')).first();
      const svgEl = await element.all(by.css('#maincontent .btn-icon')).first().element(by.css('.ripple-effect'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await buttonEl.sendKeys(protractor.Key.ENTER);
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(svgEl), config.waitsFor);

      expect(await svgEl.getAttribute('class')).toContain('ripple-effect');
    });

    it('Should click on "Disabled Icon Button", and not animate', async () => {
      const buttonEl = await element.all(by.css('#maincontent .btn-icon')).get(1);
      const svgEl = await element.all(by.css('#maincontent .btn-icon')).first().element(by.css('.icon'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
      await buttonEl.click();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);

      expect(await svgEl.getAttribute('class')).not.toContain('ripple-effect');
      expect(await buttonEl.isElementPresent(by.tagName('svg'))).toBeTruthy();
      expect(await buttonEl.isEnabled()).toBeFalsy();
    });

    it('Should click on "Icon Button", and animate on click', async () => {
      const buttonEl = await element.all(by.css('#maincontent .btn-icon')).first();
      const svgEl = await element.all(by.css('#maincontent .btn-icon')).first().element(by.css('.ripple-effect'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
      await buttonEl.click();

      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(svgEl), config.waitsFor);

      expect(await svgEl.getAttribute('class')).toContain('ripple-effect');
    });
  }
});

describe('Button example-with-icons tests', () => {
  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.driver.get(`${browser.baseUrl}/components/button/example-with-icons?theme=${browser.params.theme}`);
  });

  if (!utils.isSafari()) {
    it('Should open menu on return', async () => {
      const buttonEl = await element(by.id('menu-button-alone'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
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

  if (utils.isChrome()) {
    xit('Should not visual regress', async () => {
      const buttonEl = await element(by.id('menu-button-alone'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);

      expect(await browser.protractorImageComparison.checkScreen('buttonPage')).toEqual(0);
    });
  }

  // Exclude IE11: Async timeout errors
  if (!utils.isIE()) {
    it('Should be accessible on init with no WCAG 2AA violations', async () => {
      const buttonEl = await element(by.id('menu-button-alone'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
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
    await browser.driver.get(`${browser.baseUrl}/components/button/example-toggle-button.html?theme=${browser.params.theme}`);
  });

  it('Should toggle', async () => {
    const buttonEl = await element.all(by.css('.btn-icon.icon-favorite.btn-toggle')).first();
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
    await buttonEl.click();

    expect(await buttonEl.getAttribute('aria-pressed')).toBe('false');
  });
});
