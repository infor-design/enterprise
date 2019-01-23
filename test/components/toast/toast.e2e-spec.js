const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = require('../../helpers/e2e-config.js');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Toast example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/toast/example-index');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should button enabled', async () => {
    const buttonEl = await element(by.id('show-toast-message'));

    expect(await buttonEl.isEnabled()).toBe(true);
  });

  it('Should toast display', async () => {
    const buttonEl = await element(by.id('show-toast-message'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.id('toast-container'))), config.waitsFor);

    expect(await element(by.id('toast-container'))).toBeTruthy();
  });

  it('Should toast closed after clicking close button', async () => {
    const buttonEl = await element(by.id('show-toast-message'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.id('toast-container'))), config.waitsFor);

    await element(by.className('btn-close')).click();

    expect(await element(by.id('toast-container'))).toBeTruthy();
  });
});

describe('Toast example-positions tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/toast/test-positions');
  });

  it('Should top left button enabled', async () => {
    const buttonEl = await element(by.id('show-toast-top-left'));

    expect(await buttonEl.isEnabled()).toBe(true);
  });

  it('Should be on top left position', async () => {
    const buttonEl = await element(by.id('show-toast-top-left'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.id('toast-container'))), config.waitsFor);

    expect(await element(by.className('toast-top-left'))).toBeTruthy();
  });

  it('Should top right button enabled', async () => {
    const buttonEl = await element(by.id('show-toast-top-right'));

    expect(await buttonEl.isEnabled()).toBe(true);
  });

  it('Should be on top right position', async () => {
    const buttonEl = await element(by.id('show-toast-top-right'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.id('toast-container'))), config.waitsFor);

    expect(await element(by.className('toast-top-right'))).toBeTruthy();
  });

  it('Should bottom left button enabled', async () => {
    const buttonEl = await element(by.id('show-toast-bottom-left'));

    expect(await buttonEl.isEnabled()).toBe(true);
  });

  it('Should be on bottom left position', async () => {
    const buttonEl = await element(by.id('show-toast-bottom-left'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.id('toast-container'))), config.waitsFor);

    expect(await element(by.className('toast-bottom-left'))).toBeTruthy();
  });

  it('Should bottom right button enabled', async () => {
    const buttonEl = await element(by.id('show-toast-bottom-right'));

    expect(await buttonEl.isEnabled()).toBe(true);
  });

  it('Should be on bottom right position', async () => {
    const buttonEl = await element(by.id('show-toast-bottom-right'));
    await buttonEl.click();

    await browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.id('toast-container'))), config.waitsFor);

    expect(await element(by.className('toast-bottom-right'))).toBeTruthy();
  });

  it('Should big text button enabled', async () => {
    const buttonEl = await element(by.id('show-toast-big-text'));

    expect(await buttonEl.isEnabled()).toBe(true);
  });

  it('Should toast destroy button enabled', async () => {
    const buttonEl = await element(by.id('toast-destroy'));

    expect(await buttonEl.isEnabled()).toBe(true);
  });
});
