const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Accordion example-accordion-click-event tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/accordion/example-accordion-click-event');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should toast diplay when accordion is clicked', async () => {
    await browser.actions().mouseMove(await element.all(by.className('accordion-header')).first()).perform();
    await browser.actions().click(await element.all(by.className('accordion-header')).first()).perform();

    expect(await element(by.className('toast'))).toBeTruthy();
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
    await utils.setPage('/components/accordion/example-ajax');
  });

  it('Should not have errors', async () => {
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
    await utils.setPage('/components/accordion/example-index');
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
});
