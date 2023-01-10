const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

describe('Personalization tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/personalize/test-state');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should maintain chosen theme after reinitialization', async () => {
    const pageChangerButtonEl = await element.all(by.css('.page-changer'));
    const themeChoices = await element.all(by.css('.popupmenu li.is-selectable a[data-theme-name]'));
    const reinitButton = await element(by.id('reinitialize'));

    await pageChangerButtonEl[0].click();
    await browser.driver.sleep(config.sleep);
    await element.all(by.css('.popupmenu li.submenu')).get(0).click();
    await browser.driver.sleep(config.sleep);
    await themeChoices[1].click();

    const chosenTheme = await element.all(by.css('.popupmenu li.is-checked a[data-theme-name]')).getAttribute('data-theme-name');

    expect(await element.all(by.css('html')).get(0).getAttribute('class')).toContain(chosenTheme[0]);
    await browser.driver
      .wait(protractor.ExpectedConditions.stalenessOf(await element(by.css('.personalize-overlay'))), config.waitsFor);

    await reinitButton.click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('html')).get(0).getAttribute('class')).toContain(chosenTheme[0]);
  });

  it('should maintain chosen colors after reinitialization', async () => {
    const reinitButton = await element(by.id('reinitialize'));

    await element(by.css('.page-changer')).click();
    await element.all(by.css('.popupmenu li.submenu')).get(2).click();
    await browser.driver.sleep(config.sleep);
    await element.all(by.css('.popupmenu li.is-selectable a[data-rgbcolor]')).get(4).click();
    await browser.driver.sleep(config.sleep);

    const beforeInitSheet = await element(by.id('soho-personalization')).getText();
    await browser.driver
      .wait(protractor.ExpectedConditions.stalenessOf(await element(by.css('.personalize-overlay'))), config.waitsFor);

    await reinitButton.click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('soho-personalization')).getText()).toEqual(beforeInitSheet);
  });
});

describe('Personalization classes tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/personalize/example-classes.html?theme=classic&layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('should not visually regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('personalize-classes')).toEqual(0);
    });
  }
});

describe('Personalization classes short tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/personalize/test-classes-short.html?theme=classic&layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('should not visually regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('personalize-classes-short')).toEqual(0);
    });
  }
});

describe('Personalization example-tabs tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/personalize/example-tabs.html?theme=classic&layout=nofrills');
    await browser.driver.sleep(config.sleepShort);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('should not visually regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('personalize-tabs')).toEqual(0);
    });
  }
});

describe('Personalization form tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/personalize/example-form.html?theme=classic&layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('should not visually regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);

      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('personalize-form')).toEqual(0);
    });
  }
});

describe('Personalization form short tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/personalize/test-form-short.html?theme=classic&layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('should not visually regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('personalize-form-short')).toEqual(0);
    });
  }
});

describe('Personalization form2 tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/personalize/example-form2.html?theme=classic&layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('should not visually regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('personalize-form2-tabs')).toEqual(0);
    });
  }
});

describe('Personalization form 2 tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/personalize/example-form2.html?theme=classic&layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('should not visually regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('personalize-form2')).toEqual(0);
    });
  }
});

describe('Personalization form 2 short tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/personalize/test-form2-short.html?theme=classic&layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('should not visually regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('personalize-form2-short')).toEqual(0);
    });
  }
});
