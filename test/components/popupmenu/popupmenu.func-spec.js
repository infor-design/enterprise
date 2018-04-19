const AxeBuilder = require('axe-webdriverjs');

const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const rules = requireHelper('axe-rules');
requireHelper('rejection');
const axeOptions = { rules: rules.axeRules };

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Popupmenu example-selectable tests', () => {
  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.driver.get('http://localhost:4000/components/popupmenu/example-selectable');
  });

  // Exclude IE11: Async timeout errors
  if (browser.browserName !== 'ie' && browser.browserName !== 'safari') {
    it('Should be accessible on open with no WCAG2AA violations on keypress(Spacebar)', async () => {
      const buttonTriggerEl = await element(by.id('single-select-popupmenu-trigger'));
      await buttonTriggerEl.sendKeys(protractor.Key.SPACE);

      const res = await AxeBuilder(browser.driver)
        .configure(axeOptions)
        .exclude('header')
        .analyze();

      expect(res.violations.length).toEqual(0);
    });

    it('Should be accessible on close with no WCAG2AA violations on keypress(Escape)', async () => {
      const buttonTriggerEl = await element(by.id('single-select-popupmenu-trigger'));
      await buttonTriggerEl.sendKeys(protractor.Key.SPACE);
      await buttonTriggerEl.sendKeys(protractor.Key.ESCAPE);

      const res = await AxeBuilder(browser.driver)
        .configure(axeOptions)
        .exclude('header')
        .analyze();

      expect(res.violations.length).toEqual(0);
    });

    it('Should open on keypress(Enter), and close on keypress(Escape)', async () => {
      const buttonTriggerEl = await element(by.id('single-select-popupmenu-trigger'));
      await buttonTriggerEl.sendKeys(protractor.Key.SPACE);

      expect(await buttonTriggerEl.getAttribute('class')).toContain('is-open');
      await buttonTriggerEl.sendKeys(protractor.Key.ESCAPE);

      expect(await buttonTriggerEl.getAttribute('class')).not.toContain('is-open');
    });

    it('Should open on keypress(Space)', async () => {
      const buttonTriggerEl = await element(by.id('single-select-popupmenu-trigger'));
      await buttonTriggerEl.sendKeys(protractor.Key.SPACE);

      expect(await buttonTriggerEl.getAttribute('class')).toContain('is-open');
    });

    it('Should open with enter, and arrow down to the last menu item, and focus', async () => {
      const bodyEl = await element(by.css('body'));
      const buttonTriggerEl = await element(by.id('single-select-popupmenu-trigger'));
      await buttonTriggerEl.sendKeys(protractor.Key.ENTER);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);

      expect(await element.all(by.css('#popupmenu-2 li')).last().getAttribute('class')).toEqual('is-focused');
    });

    it('Should select last item on spacebar, arrowing down', async () => {
      const bodyEl = await element(by.css('body'));
      const buttonTriggerEl = await element(by.id('single-select-popupmenu-trigger'));
      await buttonTriggerEl.sendKeys(protractor.Key.ENTER);
      const listItem = await element.all(by.css('#popupmenu-2 li')).last();
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await element.all(by.css('#popupmenu-2 li a')).last().sendKeys(protractor.Key.SPACE);

      expect(await listItem.getAttribute('class')).toEqual('is-checked');
    });
  }
});

describe('Popupmenu example-selectable-multiple tests', () => {
  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.driver.get('http://localhost:4000/components/popupmenu/example-selectable-multiple');
  });

  if (browser.browserName !== 'ie' && browser.browserName !== 'safari') {
    it('Should select first, and last item on spacebar, arrowing down', async () => {
      const bodyEl = await element(by.css('body'));
      const buttonTriggerEl = await element(by.id('multi-select-popupmenu-trigger'));
      await buttonTriggerEl.sendKeys(protractor.Key.ENTER);
      const lastItem = await element.all(by.css('#popupmenu-2 li')).last();
      const firstItem = await element.all(by.css('#popupmenu-2 li')).first();
      await element.all(by.css('#popupmenu-2 li a')).first().sendKeys(protractor.Key.SPACE);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await element.all(by.css('#popupmenu-2 li a')).last().sendKeys(protractor.Key.SPACE);

      expect(await lastItem.getAttribute('class')).toEqual('is-focused is-checked');
      expect(await firstItem.getAttribute('class')).toEqual('is-checked');
    });

    it('Should select first, and last item on spacebar, unselect last item, arrowing down', async () => {
      const bodyEl = await element(by.css('body'));
      const buttonTriggerEl = await element(by.id('multi-select-popupmenu-trigger'));
      await buttonTriggerEl.sendKeys(protractor.Key.ENTER);
      const lastItem = await element.all(by.css('#popupmenu-2 li')).last();
      const firstItem = await element.all(by.css('#popupmenu-2 li')).first();
      await element.all(by.css('#popupmenu-2 li a')).first().sendKeys(protractor.Key.SPACE);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await element.all(by.css('#popupmenu-2 li a')).last().sendKeys(protractor.Key.SPACE);

      expect(await lastItem.getAttribute('class')).toEqual('is-focused is-checked');
      expect(await firstItem.getAttribute('class')).toEqual('is-checked');
      await element.all(by.css('#popupmenu-2 li a')).last().sendKeys(protractor.Key.SPACE);

      expect(await lastItem.getAttribute('class')).not.toEqual('is-focused is-checked');
    });
  }
});
