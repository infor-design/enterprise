const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Cards example-expandable-cards tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/cards/example-expandable-cards?layout=nofrills');
    await browser.driver.wait(protractor.ExpectedConditions.invisibilityOf(element(by.className('card-pane'))), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should be expandable card', async () => {
    expect(await element(by.className('expandable-card')).isPresent()).toBeTruthy();
    expect(await element(by.className('expandable-card-header')).isPresent()).toBeTruthy();
  });

  it('should be able to expand after clicked', async () => {
    const pane = await element(by.id('card-id-1-content'));
    const trigger = await element(by.id('card-id-1-expander'));

    expect(await pane.isDisplayed()).toBe(false);

    await trigger.click();
    await browser.driver.wait(protractor.ExpectedConditions
      .visibilityOf(pane), config.waitsFor);

    expect(await pane.isDisplayed()).toBe(true);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'card-expandable')).toEqual(0);
    });
  }

  it('should be able to set ids/automation ids', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('card-id-1-card')).getAttribute('id')).toEqual('card-id-1-card');
    expect(await element(by.id('card-id-1-card')).getAttribute('data-automation-id')).toEqual('card-automation-id-1-card');

    expect(await element(by.id('card-id-1-expander')).getAttribute('id')).toEqual('card-id-1-expander');
    expect(await element(by.id('card-id-1-expander')).getAttribute('data-automation-id')).toEqual('card-automation-id-1-expander');

    expect(await element(by.id('card-id-1-action')).getAttribute('id')).toEqual('card-id-1-action');
    expect(await element(by.id('card-id-1-action')).getAttribute('data-automation-id')).toEqual('card-automation-id-1-action');

    expect(await element(by.id('card-id-1-content')).getAttribute('id')).toEqual('card-id-1-content');
    expect(await element(by.id('card-id-1-content')).getAttribute('data-automation-id')).toEqual('card-automation-id-1-content');
  });
});

describe('Cards example-single-select tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/cards/example-single-select?layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should be single selectable', async () => {
    expect(await element(by.className('single')).isPresent()).toBeTruthy();
  });

  it('should have a cards class wrapper', async () => {
    expect(await element(by.className('cards')).isPresent()).toBeTruthy();
  });

  it('should have a card single select', async () => {
    expect(await element(by.className('card')).isPresent()).toBeTruthy();
  });

  it('should have single select cards be selectable', async () => {
    expect(await element.all(by.className('is-selectable')).isPresent()).toBeTruthy();
  });

  it('should select only 1 card', async () => {
    const cardEl1 = await element.all(by.css('.card.is-selectable')).get(0);
    const cardEl2 = await element.all(by.css('.card.is-selectable')).get(1);
    const cardEl3 = await element.all(by.css('.card.is-selectable')).get(2);

    await cardEl1.click();
    await cardEl2.click();
    await cardEl3.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.is-selected'))), config.waitsFor);

    expect(await element.all(by.css('.card.is-selectable')).get(0).getAttribute('class')).not.toContain('is-selected');
    expect(await element.all(by.css('.card.is-selectable')).get(1).getAttribute('class')).not.toContain('is-selected');
    expect(await element.all(by.css('.card.is-selectable')).get(2).getAttribute('class')).toContain('is-selected');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      const cardEl = await element.all(by.css('.card.is-selectable')).get(0);

      await cardEl.click();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'card-single-select')).toEqual(0);
    });
  }
});

describe('Cards example-multi-select tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/cards/example-multi-select?layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should be multi selectable', async () => {
    expect(await element(by.className('multiple')).isPresent()).toBeTruthy();
  });

  it('should have a cards class wrapper', async () => {
    expect(await element(by.className('cards')).isPresent()).toBeTruthy();
  });

  it('should have a card single select', async () => {
    expect(await element(by.className('card')).isPresent()).toBeTruthy();
  });

  it('should have single select cards be selectable', async () => {
    expect(await element.all(by.className('is-selectable')).isPresent()).toBeTruthy();
  });

  it('should have checkbox and checkbox label', async () => {
    expect(await element.all(by.css('input[type=checkbox].checkbox')).isPresent()).toBeTruthy();
    expect(await element.all(by.css('.checkbox-label')).isPresent()).toBeTruthy();
  });

  it('should selected all cards', async () => {
    const cardEl1 = await element.all(by.css('.card.is-selectable')).get(0);
    const cardEl2 = await element.all(by.css('.card.is-selectable')).get(1);
    const cardEl3 = await element.all(by.css('.card.is-selectable')).get(2);

    await cardEl1.click();
    await cardEl2.click();
    await cardEl3.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.is-selected'))), config.waitsFor);

    expect(await element.all(by.css('.card.is-selectable')).get(0).getAttribute('class')).toContain('is-selected');
    expect(await element.all(by.css('.card.is-selectable')).get(1).getAttribute('class')).toContain('is-selected');
    expect(await element.all(by.css('.card.is-selectable')).get(2).getAttribute('class')).toContain('is-selected');
  });

  it('should checked all the cards', async () => {
    const cardEl1 = await element.all(by.css('.card.is-selectable')).get(0);
    const cardEl2 = await element.all(by.css('.card.is-selectable')).get(1);
    const cardEl3 = await element.all(by.css('.card.is-selectable')).get(2);

    await cardEl1.click();
    await cardEl2.click();
    await cardEl3.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.css('.is-selected'))), config.waitsFor);

    await browser.driver.sleep(config.sleep);

    expect(await browser.executeScript("return window.getComputedStyle(document.querySelector('label#multiple-card-id-checkbox-label-0'), ':before').getPropertyValue('background-color')")).toEqual('rgb(0, 114, 237)');
    expect(await browser.executeScript("return window.getComputedStyle(document.querySelector('label#multiple-card-id-checkbox-label-1'), ':before').getPropertyValue('background-color')")).toEqual('rgb(0, 114, 237)');
    expect(await browser.executeScript("return window.getComputedStyle(document.querySelector('label#multiple-card-id-checkbox-label-2'), ':before').getPropertyValue('background-color')")).toEqual('rgb(0, 114, 237)');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      const cardEl1 = await element.all(by.css('.card.is-selectable')).get(0);
      const cardEl2 = await element.all(by.css('.card.is-selectable')).get(1);

      await cardEl1.click();
      await cardEl2.click();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'card-multi-select')).toEqual(0);
    });
  }
});

describe('Cards example-variations-hitboxes Visual Test', () => {
  beforeEach(async () => {
    await utils.setPage('/components/cards/example-variations-hitboxes.html?layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visual regress', async () => {
      const containerEl = await element(by.className('container'));

      expect(await browser.imageComparison.checkElement(containerEl, 'cards-hitboxes')).toEqual(0);
    });
  }
});
