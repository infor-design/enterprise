const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Accordion example-accordion-click-event tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/accordion/example-accordion-click-event');
  });

  it('Should click accordion be displayed', async () => {
    expect(await element(by.className('accordion'))).toBeTruthy();
  });

  it('Should click accordion be expanded', async () => {
    const buttonEl = await element.all(by.tagName('button')).first();
    await buttonEl.click();

    expect(await element(by.css('[aria-expanded="true"]'))).toBeTruthy();
  });

  it('Should accordion click event be shown', async () => {
    const accordionEl = await element.all(by.className('accordion-header')).first();

    await browser.actions().mouseMove(accordionEl).perform();
    await browser.actions().click(accordionEl).perform();

    expect(await element(by.className('toast'))).toBeTruthy();
  });
});

describe('Accordion example-accordion-lazy-loading tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/accordion/example-accordion-lazy-loading');
  });

  it('Should lazy accordion be displayed', async () => {
    expect(await element(by.className('accordion'))).toBeTruthy();
  });

  it('Should lazy accordion be expanded', async () => {
    const buttonEl = await element.all(by.tagName('button')).first();
    await buttonEl.click();

    expect(await element(by.css('[aria-expanded="true"]'))).toBeTruthy();
  });
});

describe('Accordion example-accordion-panels tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/accordion/example-accordion-panels');
  });

  it('Should panel accordion be displayed', async () => {
    expect(await element(by.className('accordion'))).toBeTruthy();
  });

  it('Should accordion have panels', async () => {
    expect(await element(by.className('accordion panel'))).toBeTruthy();
  });

  it('Should panel accordion be expanded', async () => {
    const buttonEl = await element.all(by.tagName('button')).first();
    await buttonEl.click();

    expect(await element(by.css('[aria-expanded="true"]'))).toBeTruthy();
  });
});

describe('Accordion example-ajax tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/accordion/example-ajax');
  });

  it('Should ajax accordion be displayed', async () => {
    expect(await element(by.className('accordion'))).toBeTruthy();
  });

  it('Should ajax accordion be expanded', async () => {
    const buttonEl = await element.all(by.tagName('button')).first();
    await buttonEl.click();

    expect(await element(by.css('[aria-expanded="true"]'))).toBeTruthy();
  });
});

describe('Accordion example-disabled tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/accordion/example-disabled');
  });

  it('Should accordion be disabled', async () => {
    expect(await element(by.className('is-disabled'))).toBeTruthy();
  });

  it('Should disabled accordion be displayed', async () => {
    expect(await element(by.className('accordion is-disabled'))).toBeTruthy();
  });
});

describe('Accordion example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/accordion/example-index');
  });

  it('Should accordion be displayed', async () => {
    expect(await element(by.className('accordion'))).toBeTruthy();
  });

  it('Should accordion can be expanded', async () => {
    const buttonEl = await element.all(by.tagName('button')).first();
    await buttonEl.click();

    expect(await element(by.css('[aria-expanded="true"]'))).toBeTruthy();
  });
});
