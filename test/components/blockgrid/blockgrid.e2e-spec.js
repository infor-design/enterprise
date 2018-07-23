const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Blockgrid example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/blockgrid/example-index');
  });

  it('Should have a blockgrid', async () => {
    expect(await element(by.className('blockgrid'))).toBeTruthy();
  });

  it('Should have a block', async () => {
    expect(await element(by.className('block'))).toBeTruthy();
  });
});

describe('Blockgrid example-mixed-selection tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/blockgrid/example-mixed-selection');
  });

  it('Should have a blockgrid mixed selection', async () => {
    expect(await element(by.className('blockgrid'))).toBeTruthy();
  });

  it('Should have a block mixed selection', async () => {
    expect(await element(by.className('block'))).toBeTruthy();
  });

  it('Should blocks be selectable', async () => {
    expect(await element(by.className('is-selectable'))).toBeTruthy();
  });

  it('Should block highlight after clicked', async () => {
    const blockEl = await element.all(by.css('.block.is-selectable')).first();
    await blockEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.is-activated'))), config.waitsFor);

    expect(await blockEl.getAttribute('class')).toContain('is-activated');
  });

  it('Should block checked after selected', async () => {
    const blockEl = await element.all(by.css('.block.is-selectable')).first();
    const checkEl = await element(by.css("label[for='checkbox0']"));
    await browser.actions().mouseMove(blockEl).click().perform();

    await checkEl.click();

    expect(await blockEl.getAttribute('class')).toContain('is-selected');
  });
});

describe('Blockgrid example-multiselect tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/blockgrid/example-multiselect');
  });

  it('Should have a blockgrid multiselect', async () => {
    expect(await element(by.className('blockgrid'))).toBeTruthy();
  });

  it('Should have a block multiselect', async () => {
    expect(await element(by.className('block'))).toBeTruthy();
  });

  it('Should all blocks be selectable', async () => {
    expect(await element.all(by.className('is-selectable'))).toBeTruthy();
  });

  it('Should blocks highlight after clicked', async () => {
    const blockEl1 = await element.all(by.css('.block.is-selectable')).get(1);
    const blockEl2 = await element.all(by.css('.block.is-selectable')).get(2);

    await browser.actions().mouseMove(blockEl1).click().perform();
    await browser.actions().mouseMove(blockEl2).click().perform();

    expect(await element(by.className('is-activated'))).toBeTruthy();
  });

  it('Should blocks checked after selected', async () => {
    const blockEl1 = await element.all(by.css('.block.is-selectable')).get(1);
    const blockEl2 = await element.all(by.css('.block.is-selectable')).get(2);
    const checkEl1 = await element(by.css("label[for='checkbox0']"));
    const checkEl2 = await element(by.css("label[for='checkbox1']"));

    await browser.actions().mouseMove(blockEl1).click().perform();
    await browser.actions().mouseMove(checkEl1).click().perform();

    await browser.actions().mouseMove(blockEl2).click().perform();
    await browser.actions().mouseMove(checkEl2).click().perform();

    expect(await element(by.className('is-selected'))).toBeTruthy();
  });
});

describe('Blockgrid example-singleselect tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/blockgrid/example-singleselect');
  });

  it('Should have a blockgrid singleselect', async () => {
    expect(await element(by.className('blockgrid'))).toBeTruthy();
  });

  it('Should have a block singleselect', async () => {
    expect(await element(by.className('block'))).toBeTruthy();
  });

  it('Should singleselect blocks be selectable', async () => {
    expect(await element.all(by.className('is-selectable'))).toBeTruthy();
  });

  it('Should blocks singleselect highlight after clicked', async () => {
    const blockEl1 = await element.all(by.css('.block.is-selectable')).get(1);

    await browser.actions().mouseMove(blockEl1).click().perform();

    expect(await element(by.className('is-selected'))).toBeTruthy();
  });

  it('Should blocks singleselect checked after selected', async () => {
    const blockEl1 = await element.all(by.css('.block.is-selectable')).get(1);
    const checkEl1 = await element(by.css("label[for='checkbox0']"));

    await browser.actions().mouseMove(blockEl1).click().perform();
    await browser.actions().mouseMove(checkEl1).click().perform();

    expect(await element(by.className('is-selected'))).toBeTruthy();
  });
});

describe('Blockgrid example-text tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/blockgrid/example-text');
  });

  it('Should have a blockgrid in the page', async () => {
    expect(await element.all(by.css('.row.blockgrid.l-center'))).toBeTruthy();
  });

  it('Should have a block in the page', async () => {
    expect(await element(by.className('block'))).toBeTruthy();
  });

  it('Should have a text in the page', async () => {
    expect(await element(by.css('p'))).toBeTruthy();
  });
});
