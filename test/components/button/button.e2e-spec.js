const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

const axePageObjects = requireHelper('axe-page-objects');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Button example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/button/example-index');
  });

  if (!utils.isSafari() && !utils.isIE()) {
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
    await utils.setPage('/components/button/example-with-icons');
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

  if (!utils.isIE()) {
    it('Should be accessible on click with no WCAG 2AA violations', async () => {
      const buttonEl = await element(by.id('menu-button-alone'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
      await buttonEl.click();
      await browser.driver.sleep(config.sleep);
      const res = await axePageObjects(browser.params.theme);

      expect(res.violations.length).toEqual(0);
    });
  }
});

describe('Button example-toggle-button tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/button/example-toggle-button');
  });

  it('Should toggle', async () => {
    const buttonEl = await element.all(by.css('.btn-icon.icon-favorite.btn-toggle')).first();
    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), config.waitsFor);
    await buttonEl.click();

    expect(await buttonEl.getAttribute('aria-pressed')).toBe('false');
  });
});
