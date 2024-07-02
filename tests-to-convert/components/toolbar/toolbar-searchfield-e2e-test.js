const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

// Searchfield IDs
const sfId = 'regular-toolbar-searchfield';
const searchfieldInput = 'toolbar-searchfield-01';

const containerElClass = '.container';

describe('Toolbar Searchfield (no-reinvoke)', () => {
  beforeEach(async () => {
    await utils.setPage('/components/toolbar/test-searchfield-no-reinvoke-update?layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id(sfId))), config.waitsFor);
  });

  it('can be updated without issues', async () => {
    await element(by.id('update-toolbar')).click();
    await browser.driver.sleep(config.sleep);

    await utils.checkForErrors();
  });
});

describe('Searchfield with Toolbar alignment tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/toolbarsearchfield/example-flex-toolbar-align-with-searchfield?theme=classic');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id(searchfieldInput))), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('should not visually regress on example-flex-toolbar-align-with-searchfield', async () => {
      const searchfieldInputEl = await element(by.id(searchfieldInput));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(searchfieldInputEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(searchfieldInputEl, 'toolbar-searchfield-init')).toBeLessThan(0.2);
    });
  }
});

describe('Toolbar Input tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/toolbar/example-toolbar-input?theme=new');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id('toolbar-searchfield'))), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should be visible have errors', async () => {
    expect(await element(by.id('toolbar-searchfield')).isDisplayed()).toBeTruthy();
  });
});

describe('Toolbar Searchfield example-flex-toolbar-align-with-searchfield tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/toolbarsearchfield/example-flex-toolbar-align-with-searchfield?layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('should have the same height with the collapse button on smaller viewport (collapsible)', async () => {
      const searchEl = await element(by.css('.toolbar-section.search'));
      await browser.driver.manage().window().setSize(766, 700);
      await browser.driver.sleep(config.sleep);

      await element(by.id('toolbar-searchfield-01')).click();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(searchEl, 'toolbar-flex-searchfield-collapsible')).toEqual(0);
    });

    xit('should have the same height with the collapse button on smaller viewport (non-collapsible)', async () => {
      const containerEl = await element(by.css(containerElClass));
      await browser.driver.manage().window().setSize(766, 700);
      await browser.driver.sleep(config.sleep);

      await element(by.id('toolbar-searchfield-02')).click();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'toolbar-flex-searchfield-non-collapsible')).toEqual(0);
    });
  }
});
