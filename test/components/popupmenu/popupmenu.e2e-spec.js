const popupmenuPageObject = require('./helpers/popupmenu-page-objects.js');

const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');
const axePageObjects = requireHelper('axe-page-objects');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Contextmenu index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/contextmenu/example-index');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should open on click and close on click out', async () => {
    const popupmenu = await element(by.id('action-popupmenu'));
    await browser.actions().click(protractor.Button.RIGHT).perform();
    await browser.driver.sleep(config.waitsFor);
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(popupmenu), config.waitsFor);

    expect(await element(by.id('action-popupmenu')).getAttribute('class')).toContain('is-open');

    await browser.actions().click(protractor.Button.Left).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.invisibilityOf(popupmenu), config.waitsFor);

    expect(await popupmenu.getAttribute('class')).not.toContain('is-open');
  });
});

describe('Popupmenu example-selectable tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/popupmenu/example-selectable');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on example-selectable', async () => {
      const popupmenuSection = await element(by.id('maincontent'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(popupmenuSection), config.waitsFor);
      const buttonTriggerEl = await element(by.id('single-select-popupmenu-trigger'));
      await buttonTriggerEl.click();
      await browser.driver.sleep(config.waitsFor);

      expect(await browser.protractorImageComparison.checkElement(popupmenuSection, 'popupmenu-single-open')).toEqual(0);
    });
  }

  it('Should open on click, and close on click', async () => {
    const buttonTriggerEl = await element(by.id('single-select-popupmenu-trigger'));
    await buttonTriggerEl.click();

    expect(await buttonTriggerEl.getAttribute('class')).toContain('is-open');
    await buttonTriggerEl.click();

    expect(await buttonTriggerEl.getAttribute('class')).not.toContain('is-open');
  });

  it('Should open on click', async () => {
    const buttonTriggerEl = await element(by.id('single-select-popupmenu-trigger'));
    await buttonTriggerEl.click();

    expect(await buttonTriggerEl.getAttribute('class')).toContain('is-open');
  });

  if (!utils.isIE() && !utils.isSafari()) {
    xit('Should be accessible on open with no WCAG2AA violations on keypress(Spacebar)', async () => {
      await popupmenuPageObject.openSingleSelect();
      const res = await axePageObjects(browser.params.theme);

      expect(res.violations.length).toEqual(0);
    });

    xit('Should be accessible on close with no WCAG2AA violations on keypress(Escape)', async () => {
      const buttonTriggerEl = await popupmenuPageObject.openSingleSelect();
      await buttonTriggerEl.sendKeys(protractor.Key.ESCAPE);

      const res = await axePageObjects(browser.params.theme);

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
    await utils.setPage('/components/popupmenu/example-selectable-multiple');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on example-selectable-multiple', async () => {
      const popupmenuSection = await element(by.id('maincontent'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(popupmenuSection), config.waitsFor);
      const buttonTriggerEl = await element(by.id('multi-select-popupmenu-trigger'));
      await buttonTriggerEl.click();
      await browser.driver.sleep(config.waitsFor);

      expect(await browser.protractorImageComparison.checkElement(popupmenuSection, 'popupmenu-multi-open')).toEqual(0);
    });
  }

  if (!utils.isIE() && !utils.isSafari()) {
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
