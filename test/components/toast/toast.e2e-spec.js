const utils = requireHelper('e2e-utils');
const config = require('../../helpers/e2e-config.js');

requireHelper('rejection');

describe('Toast example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/toast/example-index');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should button enabled', async () => {
    const buttonEl = await element(by.id('show-toast-message'));

    expect(await buttonEl.isEnabled()).toBe(true);
  });

  it('should display', async () => {
    const buttonEl = await element(by.id('show-toast-message'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.id('toast-container'))), config.waitsFor);

    expect(await element(by.id('toast-container'))).toBeTruthy();
  });

  it('should close after clicking close button', async () => {
    const buttonEl = await element(by.id('show-toast-message'));
    await buttonEl.click();
    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(element(by.css('.toast'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.toast')).count()).toEqual(1);

    await element(by.css('#toast-container .btn-close')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.toast')).count()).toEqual(0);
  });

  it('should close after pressing the Escape key', async () => {
    const buttonEl = await element(by.id('show-toast-message'));
    await buttonEl.click();
    await browser.driver.wait(protractor.ExpectedConditions.visibilityOf(element(by.css('.toast'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.toast')).count()).toEqual(1);

    await browser.driver.actions().sendKeys(protractor.Key.ESCAPE).perform();
    await browser.driver.sleep(config.sleep);

    expect(await element.all(by.css('.toast')).count()).toEqual(0);
  });
});

describe('Toast example-positions tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/toast/test-positions');
  });

  it('should top left button enabled', async () => {
    const buttonEl = await element(by.id('show-toast-top-left'));

    expect(await buttonEl.isEnabled()).toBe(true);
  });

  it('should be on top left position', async () => {
    const buttonEl = await element(by.id('show-toast-top-left'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.id('toast-container'))), config.waitsFor);

    expect(await element(by.className('toast-top-left'))).toBeTruthy();
  });

  it('should top right button enabled', async () => {
    const buttonEl = await element(by.id('show-toast-top-right'));

    expect(await buttonEl.isEnabled()).toBe(true);
  });

  it('should be on top right position', async () => {
    const buttonEl = await element(by.id('show-toast-top-right'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.id('toast-container'))), config.waitsFor);

    expect(await element(by.className('toast-top-right'))).toBeTruthy();
  });

  it('should bottom left button enabled', async () => {
    const buttonEl = await element(by.id('show-toast-bottom-left'));

    expect(await buttonEl.isEnabled()).toBe(true);
  });

  it('should be on bottom left position', async () => {
    const buttonEl = await element(by.id('show-toast-bottom-left'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.id('toast-container'))), config.waitsFor);

    expect(await element(by.className('toast-bottom-left'))).toBeTruthy();
  });

  it('should bottom right button enabled', async () => {
    const buttonEl = await element(by.id('show-toast-bottom-right'));

    expect(await buttonEl.isEnabled()).toBe(true);
  });

  it('should be on bottom right position', async () => {
    const buttonEl = await element(by.id('show-toast-bottom-right'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.id('toast-container'))), config.waitsFor);

    expect(await element(by.className('toast-bottom-right'))).toBeTruthy();
  });

  it('should big text button enabled', async () => {
    const buttonEl = await element(by.id('show-toast-big-text'));

    expect(await buttonEl.isEnabled()).toBe(true);
  });

  it('should toast destroy button enabled', async () => {
    const buttonEl = await element(by.id('toast-destroy'));

    expect(await buttonEl.isEnabled()).toBe(true);
  });
});
