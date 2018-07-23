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
    await blockEl.click();
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

  it('Should highlight blocks after click', async () => {
    const blockEl1 = await element.all(by.css('.block.is-selectable')).get(1);
    const blockEl2 = await element.all(by.css('.block.is-selectable')).get(2);
    await blockEl1.click();
    await blockEl2.click();

    expect(await element(by.className('is-activated'))).toBeTruthy();
  });

  it('Should select multiple blocks', async () => {
    const blockEl1 = await element.all(by.css('.block.is-selectable')).get(1);
    const blockEl2 = await element.all(by.css('.block.is-selectable')).get(2);
    const blockEl3 = await element.all(by.css('.block.is-selectable')).get(3);
    await blockEl1.click();
    await blockEl2.click();
    await blockEl3.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element.all(by.css('.is-selected')).get(3)), config.waitsFor);

    expect(await element.all(by.css('.block.is-selectable')).get(1).getAttribute('class')).toContain('is-selected');
    expect(await element.all(by.css('.block.is-selectable')).get(2).getAttribute('class')).toContain('is-selected');
    expect(await element.all(by.css('.block.is-selectable')).get(3).getAttribute('class')).toContain('is-selected');
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

  it('Should have singleselect blocks be selectable', async () => {
    expect(await element.all(by.className('is-selectable'))).toBeTruthy();
  });

  it('Should select only 1 blocks', async () => {
    const blockEl1 = await element.all(by.css('.block.is-selectable')).get(1);
    const blockEl2 = await element.all(by.css('.block.is-selectable')).get(2);
    const blockEl3 = await element.all(by.css('.block.is-selectable')).get(3);
    await blockEl1.click();
    await blockEl2.click();
    await blockEl3.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.is-selected'))), config.waitsFor);

    expect(await element.all(by.css('.block.is-selectable')).get(1).getAttribute('class')).not.toContain('is-selected');
    expect(await element.all(by.css('.block.is-selectable')).get(2).getAttribute('class')).not.toContain('is-selected');
    expect(await element.all(by.css('.block.is-selectable')).get(3).getAttribute('class')).toContain('is-selected');
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
