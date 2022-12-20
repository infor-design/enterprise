const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

const clickTabTest = async (index) => {
  const tabElTrigger = await element.all(by.className('tab')).get(index);
  await tabElTrigger.click();
  await browser.driver
    .wait(protractor.ExpectedConditions.visibilityOf(element.all(by.className('tab-panel')).get(index)), config.waitsFor);

  expect(await element.all(by.className('tab-panel')).get(index).getAttribute('class')).toContain('can-show');
  expect(await element.all(by.className('tab')).get(index).getAttribute('class')).toContain('is-selected');
};

describe('Tabs header click example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs-header/example-index?theme=classic');
    const tabsEl = await element(by.id('tab-panel-container'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on example-index', async () => {
      const tabsEl = await element(by.id('header-tabs'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(tabsEl, 'header-tabs-init')).toEqual(0);
    });
  }

  it('Should open 5th tab, on click', async () => {
    await clickTabTest('4');
  });

  it('Should open 3rd, then 2nd tab, on click screen width of 500px', async () => {
    const windowSize = await browser.driver.manage().window().getSize();
    await browser.driver.manage().window().setSize(500, 600);
    await browser.driver.sleep(config.sleep);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.id('tab-panel-container'))), config.waitsFor);
    await clickTabTest('2');
    await clickTabTest('1');
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });

  it('Should open 2nd tab, open menu tab-popupmenu, and list correct tab on screen width of 500px', async () => {
    const windowSize = await browser.driver.manage().window().getSize();
    await browser.driver.manage().window().setSize(500, 600);
    await browser.driver.sleep(config.sleep);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.id('tab-panel-container'))), config.waitsFor);
    await clickTabTest('1');
    await element(by.css('.tab-more .icon-more')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('#tab-container-popupmenu.is-open'))), config.waitsFor);

    expect(await element.all(by.css('#tab-container-popupmenu li')).get(1).getAttribute('class')).toContain('is-checked');
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });

  it('Should open 2nd tab, and select 1st tab on tab-popupmenu on screen width of 500px', async () => {
    const windowSize = await browser.driver.manage().window().getSize();
    await browser.driver.manage().window().setSize(500, 600);
    await browser.driver.sleep(config.sleep);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.id('tab-panel-container'))), config.waitsFor);
    await clickTabTest('1');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-focused')), config.waitsFor));
    await element(by.className('tab-more')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(element(by.css('.tab-more.is-open'))), config.waitsFor);

    expect(await element.all(by.css('#tab-container-popupmenu li')).get(1).getAttribute('class')).toContain('is-checked');
    await element.all(by.css('#tab-container-popupmenu li')).get(0).click();

    expect(await element(by.css('.tab-list .is-selected')).getText()).toContain('Header Tabs 1');
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });

  it('Should open 5th, 3rd, then 2nd tab, on click', async () => {
    await clickTabTest('4');
    await clickTabTest('2');
    await clickTabTest('1');
  });
});

describe('Tabs header keyboard example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs-header/example-index');
    const tabsEl = await element(by.id('tab-panel-container'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
  });

  if (utils.isChrome()) {
    it('Should open 3rd tab, on arrow right', async () => {
      await clickTabTest('0');
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-focused')), config.waitsFor));
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-focused')), config.waitsFor));
      await browser.driver.actions().sendKeys(protractor.Key.ENTER).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(element(by.css('#header-tabs-3.is-visible'))), config.waitsFor);

      expect(await element(by.id('header-tabs-3')).getAttribute('class')).toContain('can-show');
      expect(await element.all(by.className('tab')).get(2).getAttribute('class')).toContain('is-selected');
    });

    it('Should open 3rd tab, on arrow down', async () => {
      await clickTabTest('0');
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-focused')), config.waitsFor));
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-focused')), config.waitsFor));
      await browser.driver.actions().sendKeys(protractor.Key.ENTER).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(element(by.css('#header-tabs-3.is-visible'))), config.waitsFor);

      expect(await element(by.id('header-tabs-3')).getAttribute('class')).toContain('can-show');
      expect(await element.all(by.className('tab')).get(2).getAttribute('class')).toContain('is-selected');
    });

    it('Should navigate to menu on arrow up, and select header item #17', async () => {
      await clickTabTest('0');
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_UP).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-focused')), config.waitsFor));
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_UP).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-focused')), config.waitsFor));
      await browser.driver.actions().sendKeys(protractor.Key.ENTER).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(element(by.css('#header-tabs-17.is-visible'))), config.waitsFor);

      expect(await element(by.id('header-tabs-17')).getAttribute('class')).toContain('can-show');
      expect(await element.all(by.className('tab')).get(16).getAttribute('class')).toContain('is-selected');
    });

    it('Should navigate to menu on arrow left, and select header item #17', async () => {
      await clickTabTest('0');
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-focused')), config.waitsFor));
      await browser.driver.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(element(by.className('is-focused')), config.waitsFor));
      await browser.driver.actions().sendKeys(protractor.Key.ENTER).perform();
      await browser.driver
        .wait(protractor.ExpectedConditions.visibilityOf(element(by.css('#header-tabs-17.is-visible'))), config.waitsFor);

      expect(await element(by.id('header-tabs-17')).getAttribute('class')).toContain('can-show');
      expect(await element.all(by.className('tab')).get(16).getAttribute('class')).toContain('is-selected');
    });
  }
});

describe('Tabs header click example-add-tab button tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs-header/example-add-tab-button');
    const tabsEl = await element(by.id('tab-panel-container'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
  });

  it('Should add two tabs, on click, then click', async () => {
    const addTabEl = await element(by.className('add-tab-button'));
    await addTabEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element.all(by.className('tab-panel')).get(3)), config.waitsFor);

    expect(await element.all(by.css('#tab-panel-container > .tab-panel')).get(3).getAttribute('id')).toContain('new-tab-0');
    expect(await element.all(by.css('.tab-list > .tab')).get(3).getAttribute('class')).toContain('dismissible');

    await addTabEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element.all(by.className('tab-panel')).get(4)), config.waitsFor);

    expect(await element.all(by.css('#tab-panel-container > .tab-panel')).get(4).getAttribute('id')).toContain('new-tab-1');
    expect(await element.all(by.css('.tab-list > .tab')).get(4).getAttribute('class')).toContain('dismissible');
  });

  it('Should add two tabs, on click, then click, submenu should appear with correct selection at 500px', async () => {
    const windowSize = await browser.driver.manage().window().getSize();
    await browser.driver.manage().window().setSize(500, 600);
    await browser.driver.sleep(config.sleep);
    const addTabEl = await element(by.className('add-tab-button'));
    await addTabEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element.all(by.className('tab-panel')).get(3)), config.waitsFor);
    await addTabEl.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element.all(by.className('tab-panel')).get(4)), config.waitsFor);
    await element(by.css('a[href="#header-tabs-1"]')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('#header-tabs-1.is-visible'))), config.waitsFor);
    await element(by.css('.tab-more')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('#tab-container-popupmenu.is-open'))), config.waitsFor);

    expect(await element.all(by.css('#tab-container-popupmenu li')).get(1).getAttribute('class')).toContain('is-checked');
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });
});

describe('Tabs header click test-contains-vertical-tabs tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs-header/test-contains-vertical-tabs');
    const tabsEl = await element(by.id('tab-panel-container'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
  });

  it('Should open vertical tabs in a header tab', async () => {
    await element(by.css('a[href="#header-tabs-1"]')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('#header-tabs-1.is-visible'))), config.waitsFor);
    await element(by.css('a[href="#header-tabs-main"]')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('#header-tabs-main.is-visible'))), config.waitsFor);
    await element(by.css('a[href="#tabs-vertical-contacts"]')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('#tabs-vertical-contacts.is-visible'))), config.waitsFor);

    expect(await element(by.id('tabs-vertical-contacts')).getAttribute('class')).toContain('is-visible');
  });
});
