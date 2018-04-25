const AxeBuilder = require('axe-webdriverjs');

const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const rules = requireHelper('axe-rules');
requireHelper('rejection');
const axeOptions = { rules: rules.axeRules };

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Button example-index tests', () => {
  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.driver.get('http://localhost:4000/components/button/example-index.html');
  });

  if (browser.browserName !== 'safari' && browser.browserName !== 'ie') {
    if (browser.browserName === 'chrome') {
      it('Should mouseover "Primary Button", and change background-color', async () => {
        const buttonEl = await element.all(by.css('.btn-primary')).get(3);
        await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);
        await browser.driver.actions().mouseMove(buttonEl).perform();
        await browser.driver.sleep(1000);
        // Value returned will be as the browser interprets it, tricky to form a proper assertion
        expect(await buttonEl.getCssValue('background-color')).toBe('rgba(37, 120, 169, 1)');
      });
    }

    it('Should tab to "Primary Button", and animate on enter', async () => {
      const buttonEl = await element.all(by.css('.btn-primary')).get(3);
      const svgEl = await element.all(by.css('.btn-primary')).get(3).element(by.css('.ripple-effect'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await buttonEl.sendKeys(protractor.Key.ENTER);
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(svgEl), 5000);

      expect(await svgEl.getAttribute('class')).toContain('ripple-effect');
    });

    it('Should click on "Primary Button", and animate on click', async () => {
      const buttonEl = await element.all(by.css('.btn-primary')).get(3);
      const svgEl = await element.all(by.css('.btn-primary')).get(3).element(by.css('.ripple-effect'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);
      await buttonEl.click();
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(svgEl), 5000);

      expect(await svgEl.getAttribute('class')).toContain('ripple-effect');
    });

    it('Should click on "Disabled Primary Button", and not animate', async () => {
      const buttonEl = await element.all(by.css('.btn-primary')).get(2);
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);
      await buttonEl.click();
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);

      expect(await buttonEl.isElementPresent(by.tagName('svg'))).toBeFalsy();
      expect(await buttonEl.isEnabled()).toBeFalsy();
    });

    it('Should tab to "Secondary Button", and animate on enter', async () => {
      const buttonEl = await element.all(by.css('.btn-secondary')).first();
      const svgEl = await element.all(by.css('.btn-secondary')).first().element(by.css('.ripple-effect'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await buttonEl.sendKeys(protractor.Key.ENTER);
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(svgEl), 5000);

      expect(await svgEl.getAttribute('class')).toContain('ripple-effect');
    });

    it('Should click on "Disabled Secondary Button", and not animate', async () => {
      const buttonEl = await element.all(by.css('.btn-secondary')).get(1);
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);
      await buttonEl.click();
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);

      expect(await buttonEl.isElementPresent(by.tagName('svg'))).toBeFalsy();
      expect(await buttonEl.isEnabled()).toBeFalsy();
    });

    it('Should click on "Secondary Button", and animate on click', async () => {
      const buttonEl = await element.all(by.css('.btn-secondary')).first();
      const svgEl = await element.all(by.css('.btn-secondary')).first().element(by.css('.ripple-effect'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);
      await buttonEl.click();

      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(svgEl), 5000);

      expect(await svgEl.getAttribute('class')).toContain('ripple-effect');
    });

    it('Should tab to "Tertiary Button", and animate on enter', async () => {
      const buttonEl = await element.all(by.css('.btn-tertiary')).first();
      const svgEl = await element.all(by.css('.btn-tertiary')).first().element(by.css('.ripple-effect'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await buttonEl.sendKeys(protractor.Key.ENTER);
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(svgEl), 5000);

      expect(await svgEl.getAttribute('class')).toContain('ripple-effect');
    });

    it('Should click on "Disabled Tertiary Button", and not animate', async () => {
      const buttonEl = await element.all(by.css('.btn-tertiary')).get(1);
      const svgEl = await element.all(by.css('.btn-tertiary')).get(1).element(by.css('.icon'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);
      await buttonEl.click();
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);

      expect(await svgEl.getAttribute('class')).not.toContain('ripple-effect');
      expect(await buttonEl.isElementPresent(by.tagName('svg'))).toBeTruthy();
      expect(await buttonEl.isEnabled()).toBeFalsy();
    });

    it('Should click on "Tertiary Button", and animate on click', async () => {
      const buttonEl = await element.all(by.css('.btn-tertiary')).first();
      const svgEl = await element.all(by.css('.btn-tertiary')).first().element(by.css('.ripple-effect'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);
      await buttonEl.click();

      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(svgEl), 5000);

      expect(await svgEl.getAttribute('class')).toContain('ripple-effect');
    });

    it('Should tab to "Icon Button", and animate on enter', async () => {
      const buttonEl = await element.all(by.css('.btn-icon')).first();
      const svgEl = await element.all(by.css('.btn-icon')).first().element(by.css('.ripple-effect'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await element(by.css('body')).sendKeys(protractor.Key.TAB);
      await buttonEl.sendKeys(protractor.Key.ENTER);
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(svgEl), 5000);

      expect(await svgEl.getAttribute('class')).toContain('ripple-effect');
    });

    it('Should click on "Disabled Icon Button", and not animate', async () => {
      const buttonEl = await element.all(by.css('.btn-icon')).get(2);
      const svgEl = await element.all(by.css('.btn-icon')).get(1).element(by.css('.icon'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);
      await buttonEl.click();
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);

      expect(await svgEl.getAttribute('class')).not.toContain('ripple-effect');
      expect(await buttonEl.isElementPresent(by.tagName('svg'))).toBeTruthy();
      expect(await buttonEl.isEnabled()).toBeFalsy();
    });

    it('Should click on "Icon Button", and animate on click', async () => {
      const buttonEl = await element.all(by.css('.btn-icon')).first();
      const svgEl = await element.all(by.css('.btn-icon')).first().element(by.css('.ripple-effect'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);
      await buttonEl.click();

      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(svgEl), 5000);

      expect(await svgEl.getAttribute('class')).toContain('ripple-effect');
    });
  }
});

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
    xit('Should not visual regress', async () => {
      const buttonEl = await element(by.id('menu-button-alone'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);

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
