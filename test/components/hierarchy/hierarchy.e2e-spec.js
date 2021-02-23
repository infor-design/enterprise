const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Hierarchy index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/hierarchy/example-index?theme=classic&layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const windowSize = await browser.driver.manage().window().getSize();
      await browser.driver.manage().window().setSize(1500, 900);

      const containerEl = await element.all(by.id('hierarchy')).first();
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'hierarchy-index')).toEqual(0);
      await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
    });
  }
});

describe('Hierarchy context menu tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/hierarchy/example-context-menu-with-details?layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.id('hierarchy'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);
  });

  it('Should be able to set id/automation id example', async () => {
    expect(await element(by.id('1')).getAttribute('id')).toEqual('1');
    expect(await element(by.id('1')).getAttribute('data-automation-id')).toEqual('automation-id-example1-1-jonathan-cargill-hierarchy-leaf');

    expect(await element(by.id('1_3')).getAttribute('id')).toEqual('1_3');
    expect(await element(by.id('1_3')).getAttribute('data-automation-id')).toEqual('automation-id-example1-1_3-kaylee-edwards-hierarchy-leaf');

    expect(await element(by.id('example1-1_3-kaylee-edwards-hierarchy-btn-toggle')).getAttribute('id')).toEqual('example1-1_3-kaylee-edwards-hierarchy-btn-toggle');
    expect(await element(by.id('example1-1_3-kaylee-edwards-hierarchy-btn-toggle')).getAttribute('data-automation-id')).toEqual('automation-id-example1-1_3-kaylee-edwards-hierarchy-btn-toggle');

    expect(await element(by.id('btn-1_3')).getAttribute('id')).toEqual('btn-1_3');
    expect(await element(by.id('btn-1_3')).getAttribute('data-automation-id')).toEqual('automation-id-example1-1_3-kaylee-edwards-hierarchy-popupmenu-trigger');

    await element(by.id('btn-1_3')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.popupmenu.is-open'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-0')).getAttribute('id')).toEqual('example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-0');
    expect(await element(by.id('example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-0')).getAttribute('data-automation-id')).toEqual('automation-id-example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-0');
    expect(await element(by.id('example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-1')).getAttribute('id')).toEqual('example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-1');
    expect(await element(by.id('example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-1')).getAttribute('data-automation-id')).toEqual('automation-id-example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-1');
    expect(await element(by.id('example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-2')).getAttribute('id')).toEqual('example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-2');
    expect(await element(by.id('example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-2')).getAttribute('data-automation-id')).toEqual('automation-id-example1-1_3-kaylee-edwards-hierarchy-popupmenu-option-2');
  });
});
