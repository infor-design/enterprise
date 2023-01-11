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

describe('Tabs vertical click example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs-vertical/example-independent-scrolling?theme=classic');
    await browser.driver.sleep(config.sleep);
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress on example-independent-scrolling', async () => {
      const tabsEl = await element(by.id('tabs-vertical'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(tabsEl, 'tabs-vertical')).toEqual(0);
    });
  }

  it('should open 3rd tab, on click', async () => {
    await clickTabTest('2');
  });

  it('should open 3rd, then 2nd tab, on click', async () => {
    await clickTabTest('2');
    await clickTabTest('1');
  });

  it('should be able to scroll in tab panel', async () => {
    await clickTabTest('2');
    await clickTabTest('0');
    await browser.executeScript('document.querySelector("#test-info p:last-child").scrollIntoView()');
    const lastParagraph = await element(by.css('#test-info p:last-child'));
    const posLastParagraph = await lastParagraph.getLocation();

    expect(posLastParagraph.y).toBeLessThanOrEqual(700);
  });
});

describe('Tabs vertical click example-responsive tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs-vertical/example-index?theme=classic');
    const tabsEl = await element(by.id('tabs-vertical'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('should not visually regress on example-responsive at 500px', async () => {
      const windowSize = await browser.driver.manage().window().getSize();
      await browser.driver.manage().window().setSize(500, 600);
      await browser.driver.sleep(config.sleep);
      const tabsEl = await element(by.id('tabs-vertical'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(tabsEl, 'tabs-vertical-500px')).toEqual(0);
      await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
      await browser.driver.sleep(config.sleep);
    });
  }

  it('should change to header tabs at 500px then back to vertical tabs at 1200px', async () => {
    const windowSize = await browser.driver.manage().window().getSize();
    await browser.driver.manage().window().setSize(500, 600);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.className('tab-container')).getAttribute('class')).toContain('is-in-responsive-mode');
    expect(await element(by.className('tab-container')).getAttribute('class')).toContain('header-tabs');
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.className('tab-container')).getAttribute('class')).not.toContain('is-in-responsive-mode');
    expect(await element(by.className('tab-container')).getAttribute('class')).toContain('vertical');
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });
});

describe('Tabs vertical click test-nested-regular-tabs tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/tabs-vertical/test-nested-regular-tabs');
    const tabsEl = await element(by.id('page-one-tab-two'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(tabsEl), config.waitsFor);
  });
});
