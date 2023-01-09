// eslint-disable-next-line import/no-extraneous-dependencies
const { element, browser } = require('protractor');

const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

describe('Contextmenu index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/contextmenu/example-index');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should open on click and close on click out', async () => { //eslint-disable-line
    let input = await element(by.id('input-menu2'));
    await browser.actions().mouseMove(input).perform();
    await browser.actions().click(protractor.Button.RIGHT).perform();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('action-popupmenu'))), config.waitsFor);

    expect(await element(by.id('action-popupmenu')).getAttribute('class')).toContain('is-open');

    input = await element(by.id('input-menu'));
    await element.all(by.css('label[for="input-menu"]')).click();
    await input.sendKeys(protractor.Key.TAB);

    await browser.driver
      .wait(protractor.ExpectedConditions.invisibilityOf(await element(by.id('action-popupmenu'))), config.waitsFor);

    expect(await element(by.id('action-popupmenu')).getAttribute('class')).not.toContain('is-open');
  });

  it('Should add correct aria', async () => {
    // as per https://www.w3.org/TR/wai-aria-practices/examples/menu-button/menu-button-links.html
    const input = await element(by.id('input-menu2'));
    await browser.actions().mouseMove(input).perform();
    await browser.actions().click(protractor.Button.RIGHT).perform();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('action-popupmenu'))), config.waitsFor);

    expect(await element(by.id('action-popupmenu')).getAttribute('role')).toEqual('menu');
    expect(await element(by.id('action-popupmenu')).getAttribute('aria-labelledby')).toEqual('input-menu2');
    expect(await element.all(by.css('#action-popupmenu li')).first().getAttribute('role')).toEqual('none');
    expect(await element.all(by.css('#action-popupmenu li a')).first().getAttribute('role')).toEqual('menuitem');
  });

  it('Should be able to set id/automation id', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('input-menu')).getAttribute('data-automation-id')).toEqual('action-popupmenu-trigger');
    expect(await element(by.id('action-popupmenu')).getAttribute('data-automation-id')).toEqual('action-popupmenu-menu');

    expect(await element(by.id('cut')).getAttribute('data-automation-id')).toEqual('cut-automation-id');
    expect(await element(by.id('copy')).getAttribute('data-automation-id')).toEqual('copy-automation-id');
    expect(await element(by.id('paste')).getAttribute('data-automation-id')).toEqual('paste-automation-id');
  });
});

describe('Popupmenu example-selectable tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/popupmenu/example-selectable?ltheme=classic&layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('Should not visual regress on example-selectable', async () => {
      const popupmenuSection = await element(by.css('.no-frills'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(popupmenuSection), config.waitsFor);
      const buttonTriggerEl = await element(by.id('single-select-popupmenu-trigger'));
      await buttonTriggerEl.click();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(popupmenuSection, 'popupmenu-single-open')).toEqual(0);
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

      expect(await element.all(by.css('.popupmenu.is-open li')).last().getAttribute('class')).toContain('is-focused');
    });

    it('Should select last item on spacebar, arrowing down', async () => {
      const bodyEl = await element(by.css('body'));
      await element(by.id('single-select-popupmenu-trigger')).click();
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await element.all(by.css('.popupmenu.is-open li a')).last().sendKeys(protractor.Key.SPACE);

      // Re-open menu so we can see the checked item
      await element(by.id('single-select-popupmenu-trigger')).click();

      expect(await element.all(by.css('.popupmenu.is-open li')).last().getAttribute('class')).toContain('is-checked');
    });
  }
});

// NOTE: tests for infor-design/enterprise#2458
describe('Popupmenu missing submenu tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/popupmenu/test-malformed-popupmenu?layout=nofrills');
  });

  it('Should have no errors on page load', async () => {
    await utils.checkForErrors();
  });

  it('Should have no errors when hovering an item with a submenu', async () => {
    await element(by.id('open-me')).click();

    const popupmenuElem = await element(by.css('ul.popupmenu.is-open'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(popupmenuElem), config.waitsFor);

    const thirdItem = await element(by.css('ul.popupmenu.is-open'));
    await browser.actions().mouseMove(thirdItem).perform();
    await browser.driver.sleep(config.sleep);

    await utils.checkForErrors();
  });
});

describe('Popupmenu example-selectable-multiple tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/popupmenu/example-selectable-multiple?theme=classic&layout=nofrills');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on example-selectable-multiple', async () => {
      const popupmenuSection = await element(by.css('.no-frills'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(popupmenuSection), config.waitsFor);
      const buttonTriggerEl = await element(by.id('multi-select-popupmenu-trigger'));
      await buttonTriggerEl.click();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(popupmenuSection, 'popupmenu-multi-open')).toEqual(0);
    });
  }

  if (!utils.isIE() && !utils.isSafari()) {
    it('Should select first, and last item on spacebar, arrowing down', async () => {
      const bodyEl = await element(by.css('body'));
      const buttonTriggerEl = await element(by.id('multi-select-popupmenu-trigger'));
      await buttonTriggerEl.sendKeys(protractor.Key.ENTER);
      const lastItem = await element.all(by.css('.popupmenu.is-open li')).last();
      const firstItem = await element.all(by.css('.popupmenu.is-open li')).first();
      await element.all(by.css('.popupmenu.is-open li a')).first().sendKeys(protractor.Key.SPACE);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await element.all(by.css('.popupmenu.is-open li a')).last().sendKeys(protractor.Key.SPACE);

      expect(await lastItem.getAttribute('class')).toContain('is-checked');
      expect(await firstItem.getAttribute('class')).toContain('is-checked');
    });

    it('Should select first, and last item on spacebar, unselect last item, arrowing down', async () => {
      const bodyEl = await element(by.css('body'));
      const buttonTriggerEl = await element(by.id('multi-select-popupmenu-trigger'));
      await buttonTriggerEl.sendKeys(protractor.Key.ENTER);
      const lastItem = await element.all(by.css('.popupmenu.is-open li')).last();
      const firstItem = await element.all(by.css('.popupmenu.is-open li')).first();
      await element.all(by.css('.popupmenu.is-open li a')).first().sendKeys(protractor.Key.SPACE);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
      await element.all(by.css('.popupmenu.is-open li a')).last().sendKeys(protractor.Key.SPACE);

      expect(await lastItem.getAttribute('class')).toContain('is-checked');
      expect(await firstItem.getAttribute('class')).toContain('is-checked');
      await element.all(by.css('.popupmenu.is-open li a')).last().sendKeys(protractor.Key.SPACE);

      expect(await lastItem.getAttribute('class')).not.toContain('is-checked');
    });
  }
});

describe('Popupmenu shared instance tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/popupmenu/test-multiple?layout=nofrills');
  });

  it('does not unwrap and destroy Popupmenus if they are shared', async () => {
    // Right click input 1 to open its Popupmenu
    const input1 = await element(by.id('input-menu'));
    await browser.actions().mouseMove(input1).perform();
    await browser.actions().click(protractor.Button.RIGHT).perform();

    // Right click input 2 to open its Popupmenu
    const input2 = await element(by.id('input-menu2'));
    await browser.actions().mouseMove(input2).perform();
    await browser.actions().click(protractor.Button.RIGHT).perform();

    // Click the button that destroys the 1st Popup Menu
    await element(by.id('popup-destroy-1')).click();

    // Right click input 2 to open its Popupmenu again
    await browser.actions().mouseMove(input2).perform();
    await browser.actions().click(protractor.Button.RIGHT).perform();

    // The menu should be open and displayed with no issues
    expect(await element(by.css('.popupmenu-wrapper')).isDisplayed()).toBeTruthy();
  });
});

describe('Contextmenu created dynamically tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/datagrid/test-contextmenu-dynamic');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('No errors when right click on row without the menu in the dom', async () => {
    const tableRow = await element(by.css('tbody > tr:first-of-type > td:first-of-type'));
    await browser.actions().mouseMove(tableRow).perform();
    await browser.actions().click(protractor.Button.RIGHT).perform();

    await utils.checkForErrors();

    const insertContextButton = await element(by.id('insert-context-menu-button'));
    await browser.actions().mouseMove(insertContextButton).perform();
    await browser.actions().click(protractor.Button.LEFT).perform();

    await browser.actions().mouseMove(tableRow).perform();
    await browser.actions().click(protractor.Button.RIGHT).perform();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('grid-actions-menu'))), config.waitsFor);

    expect(await element(by.id('grid-actions-menu')).getAttribute('class')).toContain('is-open');
  });
});

describe('Contextmenu immediate tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tree/example-context-menu');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should more than once on right click', async () => {
    let input = await element.all(by.css('.tree a')).first();
    await browser.actions().mouseMove(input).perform();
    await browser.actions().click(protractor.Button.RIGHT).perform();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('tree-popupmenu'))), config.waitsFor);

    expect(await element(by.id('tree-popupmenu')).getAttribute('class')).toContain('is-open');
    await element.all(by.css('#tree-popupmenu a')).first().sendKeys(protractor.Key.ESCAPE);

    await browser.driver
      .wait(protractor.ExpectedConditions.invisibilityOf(await element(by.id('tree-popupmenu'))), config.waitsFor);

    expect(await element(by.id('tree-popupmenu')).getAttribute('class')).not.toContain('is-open');

    input = await element.all(by.css('.tree a')).first();
    await browser.actions().mouseMove(input).perform();
    await browser.actions().click(protractor.Button.RIGHT).perform();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('tree-popupmenu'))), config.waitsFor);
  });
});

describe('Contextmenu Placement Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/contextmenu/example-page-rightclick');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (!utils.isBS() && !utils.isCI()) {
    it('Should correctly resize to fit within the viewport boundaries', async () => { //eslint-disable-line
      const windowSize = await browser.driver.manage().window().getSize();
      await browser.driver.manage().window().setSize(640, 296);

      // Popupmenu width is about 230px, so provide coords that would
      // otherwise push it offscreen
      const targetMouseCoords = {
        x: 500,
        y: 100
      };

      // Move the mouse to an area near the right edge of the page and click
      await browser.actions().mouseMove(targetMouseCoords).perform();
      await browser.actions().click(protractor.Button.RIGHT).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('action-popupmenu'))), config.waitsFor);

      expect(await element(by.id('action-popupmenu')).getSize()).toEqual(jasmine.objectContaining({
        height: 266
      }));

      // Reset to the original viewport size
      await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
    });
  }
});

