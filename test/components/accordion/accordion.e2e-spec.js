const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Accordion allow one pane tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/accordion/example-allow-one-pane');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should only allow one pane open at a time', async () => {
    expect(await element.all(by.className('.accordion-pane.is-expanded')).count()).toEqual(0);

    const buttonEl = await element(by.css('#accordion-one-pane > div:nth-child(1) button'));
    await buttonEl.click();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('#accordion-one-pane .accordion-pane.is-expanded'))), config.waitsFor);

    expect(await element.all(by.css('.accordion-pane.is-expanded')).count()).toEqual(1);
  });
});

describe('Accordion example-accordion-panels tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/accordion/example-accordion-panels');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should accordion have panels', async () => {
    expect(await element(by.className('accordion panel'))).toBeTruthy();
  });
});

describe('Accordion example-ajax tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/accordion/test-ajax');

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('#ajax-accordion .accordion-header'))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('#ajax-accordion .accordion-header'))), config.waitsFor);

    await utils.checkForErrors();
  });

  it('Should ajax data is in the headers', async () => {
    const buttonEl = await element(by.css('#ajax-accordion .accordion-header button'));
    await buttonEl.click();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('#ajax-accordion .accordion-pane.is-expanded > .accordion-header:first-child'))), config.waitsFor);

    expect(await element(by.css('#ajax-accordion .accordion-pane.is-expanded > .accordion-header:first-child')).getText()).toEqual('Apples');
  });
});

describe('Accordion lazy loading tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/accordion/test-lazy-loading');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should load data when header is clicked', async () => {
    const buttonEl = await element(by.css('#ajax-accordion .accordion-header button'));
    await buttonEl.click();

    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('#ajax-accordion .accordion-pane.is-expanded > .accordion-header:first-child'))), config.waitsFor);

    await browser.driver.sleep(600);

    expect(await element(by.css('#ajax-accordion .accordion-pane.is-expanded > .accordion-header:first-child')).getText()).toEqual('Apples');
  });
});

describe('Accordion Collapse Children tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/accordion/test-close-children-on-collapse');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should close all children components', async () => {
    const buttonEl = await element(by.css('#start-test'));
    await buttonEl.click();

    await browser.driver.sleep(2600);

    expect(await element.all(by.css('#dropdown-list')).count()).toBe(0);
    expect(await element.all(by.css('#monthview-popup')).count()).toBe(0);
  });
});

describe('Accordion example-disabled tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/accordion/example-disabled');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should accordion be disabled', async () => {
    expect(await element.all(by.css('.accordion-header.is-disabled')).count()).toEqual(4);
    expect(await element.all(by.css('.accordion.is-disabled')).count()).toEqual(1);
  });
});

describe('Accordion example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/accordion/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should accordion be displayed', async () => {
    expect(await element(by.className('accordion'))).toBeTruthy();
  });

  it('Should accordion can be expanded', async () => {
    const buttonEl = await element.all(by.tagName('button')).first();
    await buttonEl.click();

    expect(await element(by.css('[aria-expanded="true"]'))).toBeTruthy();
  });

  it('Should keyboard working on focus in accordion ', async () => {
    const accordionEl = await element.all(by.className('accordion-header')).first();

    await browser.actions().mouseMove(accordionEl).perform();
    await browser.actions().click(accordionEl).perform();

    expect(await element(by.className('is-focused'))).toBeTruthy();

    await browser.actions().click(accordionEl).perform();
    await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();

    expect(await element(by.className('is-focused'))).toBeTruthy();
  });

  it('Should keyboard working on expand in accordion ', async () => {
    const accordionEl = await element.all(by.className('accordion-header')).first();

    await browser.actions().mouseMove(accordionEl).perform();
    await browser.actions().click(accordionEl).perform();

    expect(await element(by.className('is-expanded'))).toBeTruthy();

    await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
    await browser.actions().sendKeys(protractor.Key.ENTER).perform();

    expect(await element(by.className('is-expanded'))).toBeTruthy();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const buttonEl = await element.all(by.tagName('button')).get(2);
      await buttonEl.click();

      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkElement(containerEl, 'accordion-index')).toEqual(0);
    });
  }
});

describe('Accordion expand multiple tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/accordion/test-expand-all');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should expand both panes', async () => {
    expect(await element.all(by.css('#nested-accordion > .accordion-header.is-expanded')).count()).toEqual(2);
    await element.all(by.css('#nested-accordion > .accordion-header.is-expanded + .accordion-pane.is-expanded')).get(0).getSize().then((size) => {
      expect(size.height).not.toBeLessThan(50);
    });
    await element.all(by.css('#nested-accordion > .accordion-header.is-expanded + .accordion-pane.is-expanded')).get(1).getSize().then((size) => {
      expect(size.height).not.toBeLessThan(50);
    });
  });
});

describe('Accordion adding headers dynamically tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/accordion/test-add-dynamically.html?layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('can dynamically add and navigate to new accordion headers', async () => {
    // Add two headers
    const addBtn = await element(by.id('addFavs'));
    await addBtn.click();
    await addBtn.click();

    // Expand the "Favorites" header
    await element.all(by.css('#test-accordion > .accordion-header')).last().click();
    await browser.driver.sleep(config.sleep);

    // Tab to the last of the new headers and check its content
    await browser.driver.actions()
      .sendKeys(protractor.Key.TAB)
      .sendKeys(protractor.Key.TAB)
      .sendKeys(protractor.Key.TAB)
      .sendKeys(protractor.Key.TAB)
      .perform();
    const focusedElem = await browser.driver.switchTo().activeElement();

    expect(await focusedElem.getText()).toEqual('Dynamically-Added Favorite (1)');
  });
});
