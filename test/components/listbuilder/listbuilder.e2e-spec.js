const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Listbuilder example-index Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/listbuilder/example-index');
    const listbuilderEl = await element(by.id('example-listbuilder'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(listbuilderEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should let add item', async () => {
    expect(await element.all(by.css('li[role="option"]')).count()).toEqual(12);
    await element(await by.css('button[data-action="add"]')).click();

    expect(await element.all(by.css('li[role="option"]')).count()).toEqual(13);
  });

  it('Should let move up item', async () => {
    expect(await element(by.css('li[role="option"]:nth-child(2) .item-content')).getText()).toEqual('Belize');
    await element(await by.css('li[role="option"]:nth-child(2)')).click();
    await element(await by.css('button[data-action="goup"]')).click();

    expect(await element(by.css('li[role="option"]:nth-child(2) .item-content')).getText()).toEqual('Argentina');
  });

  it('Should let move down item', async () => {
    expect(await element(by.css('li[role="option"]:nth-child(2) .item-content')).getText()).toEqual('Belize');
    await element(await by.css('li[role="option"]:nth-child(2)')).click();
    await element(await by.css('button[data-action="godown"]')).click();

    expect(await element(by.css('li[role="option"]:nth-child(2) .item-content')).getText()).toEqual('Colombia');
  });

  it('Should let edit item', async () => {
    expect(await element(by.css('li[role="option"]:nth-child(2) .item-content')).getText()).toEqual('Belize');
    await element(await by.css('li[role="option"]:nth-child(2)')).click();
    await element(await by.css('button[data-action="edit"]')).click();
    const item = await element(by.css('li[role="option"]:nth-child(2) .edit-input'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(item), config.waitsFor);
    await item.sendKeys('test');
    await item.sendKeys(protractor.Key.ENTER);

    expect(await element(by.css('li[role="option"]:nth-child(2) .item-content')).getText()).toEqual('test');
  });

  it('Should let edit item and sanitize entered content', async () => {
    expect(await element(by.css('li[role="option"]:nth-child(2) .item-content')).getText()).toEqual('Belize');
    await element(await by.css('li[role="option"]:nth-child(2)')).click();
    await element(await by.css('button[data-action="edit"]')).click();
    const item = await element(by.css('li[role="option"]:nth-child(2) .edit-input'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(item), config.waitsFor);
    await item.sendKeys('<script>alert("hi")</script>');
    await item.sendKeys(protractor.Key.ENTER);

    expect(await element(by.css('li[role="option"]:nth-child(2) .item-content')).getText()).toEqual('<script>alert("hi")</script>');
  });

  it('Should let delete item', async () => {
    expect(await element.all(by.css('li[role="option"]')).count()).toEqual(12);
    await element(await by.css('li[role="option"]:nth-child(2)')).click();
    await element(await by.css('button[data-action="delete"]')).click();

    expect(await element.all(by.css('li[role="option"]')).count()).toEqual(11);
  });
});

describe('Listbuilder Update Dataset Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/listbuilder/test-update-dataset');
    const listbuilderEl = await element(by.id('example-listbuilder'));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(listbuilderEl), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should update dataset', async () => {
    expect(await element.all(by.css('li[role="option"]')).count()).toEqual(12);
    await element(await by.id('btn1')).click();

    expect(await element.all(by.css('li[role="option"]')).count()).toEqual(3);
  });
});
