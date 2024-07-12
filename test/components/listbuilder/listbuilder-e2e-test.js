const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

describe('Listbuilder example-index Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/listbuilder/example-index');
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('li[data-value="opt-12"]'))), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should let add item', async () => {
    expect(await element.all(by.css('li[role="option"]')).count()).toEqual(12);
    await element(await by.css('button[data-action="add"]')).click();

    expect(await element.all(by.css('li[role="option"]')).count()).toEqual(13);
  });

  it('should let move up item', async () => {
    expect(await element(by.css('li[role="option"]:nth-child(2) .item-content')).getText()).toEqual('Belize');
    await element(await by.css('li[role="option"]:nth-child(2)')).click();
    await element(await by.css('button[data-action="goup"]')).click();

    expect(await element(by.css('li[role="option"]:nth-child(2) .item-content')).getText()).toEqual('Argentina');
  });

  it('should let move down item', async () => {
    expect(await element(by.css('li[role="option"]:nth-child(2) .item-content')).getText()).toEqual('Belize');
    await element(await by.css('li[role="option"]:nth-child(2)')).click();
    await element(await by.css('button[data-action="godown"]')).click();

    expect(await element(by.css('li[role="option"]:nth-child(2) .item-content')).getText()).toEqual('Colombia');
  });

  it('should let edit item', async () => {
    expect(await element(by.css('li[role="option"]:nth-child(2) .item-content')).getText()).toEqual('Belize');
    await element(await by.css('li[role="option"]:nth-child(2)')).click();
    await element(await by.css('button[data-action="edit"]')).click();
    const item = await element(by.css('li[role="option"]:nth-child(2) .edit-input'));
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(item), config.waitsFor);
    await item.sendKeys('test');
    await item.sendKeys(protractor.Key.ENTER);

    expect(await element(by.css('li[role="option"]:nth-child(2) .item-content')).getText()).toEqual('test');
  });

  it('should let edit item and sanitize entered content', async () => {
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

  it('should let delete item', async () => {
    expect(await element.all(by.css('li[role="option"]')).count()).toEqual(12);
    await element(await by.css('li[role="option"]:nth-child(2)')).click();
    await element(await by.css('button[data-action="delete"]')).click();

    expect(await element.all(by.css('li[role="option"]')).count()).toEqual(11);
  });

  it('should be able to set id/automation id example', async () => {
    expect(await element(by.id('example1-listbuilder-btn-add')).getAttribute('id')).toEqual('example1-listbuilder-btn-add');
    expect(await element(by.id('example1-listbuilder-btn-add')).getAttribute('data-automation-id')).toEqual('automation-id-example1-listbuilder-btn-add');

    expect(await element(by.id('example1-listbuilder-btn-goup')).getAttribute('id')).toEqual('example1-listbuilder-btn-goup');
    expect(await element(by.id('example1-listbuilder-btn-goup')).getAttribute('data-automation-id')).toEqual('automation-id-example1-listbuilder-btn-goup');

    expect(await element(by.id('example1-listbuilder-btn-godown')).getAttribute('id')).toEqual('example1-listbuilder-btn-godown');
    expect(await element(by.id('example1-listbuilder-btn-godown')).getAttribute('data-automation-id')).toEqual('automation-id-example1-listbuilder-btn-godown');

    expect(await element(by.id('example1-listbuilder-btn-edit')).getAttribute('id')).toEqual('example1-listbuilder-btn-edit');
    expect(await element(by.id('example1-listbuilder-btn-edit')).getAttribute('data-automation-id')).toEqual('automation-id-example1-listbuilder-btn-edit');

    expect(await element(by.id('example1-listbuilder-btn-delete')).getAttribute('id')).toEqual('example1-listbuilder-btn-delete');
    expect(await element(by.id('example1-listbuilder-btn-delete')).getAttribute('data-automation-id')).toEqual('automation-id-example1-listbuilder-btn-delete');

    expect(await element(by.id('example1-listbuilder-listview')).getAttribute('id')).toEqual('example1-listbuilder-listview');
    expect(await element(by.id('example1-listbuilder-listview')).getAttribute('data-automation-id')).toEqual('automation-id-example1-listbuilder-listview');

    expect(await element(by.id('example1-listbuilder-listview-item-0')).getAttribute('id')).toEqual('example1-listbuilder-listview-item-0');
    expect(await element(by.id('example1-listbuilder-listview-item-0')).getAttribute('data-automation-id')).toEqual('automation-id-example1-listbuilder-listview-item-0');
    expect(await element(by.id('example1-listbuilder-listview-item-1')).getAttribute('id')).toEqual('example1-listbuilder-listview-item-1');
    expect(await element(by.id('example1-listbuilder-listview-item-1')).getAttribute('data-automation-id')).toEqual('automation-id-example1-listbuilder-listview-item-1');
    expect(await element(by.id('example1-listbuilder-listview-item-2')).getAttribute('id')).toEqual('example1-listbuilder-listview-item-2');
    expect(await element(by.id('example1-listbuilder-listview-item-2')).getAttribute('data-automation-id')).toEqual('automation-id-example1-listbuilder-listview-item-2');
    expect(await element(by.id('example1-listbuilder-listview-item-3')).getAttribute('id')).toEqual('example1-listbuilder-listview-item-3');
    expect(await element(by.id('example1-listbuilder-listview-item-3')).getAttribute('data-automation-id')).toEqual('automation-id-example1-listbuilder-listview-item-3');
    expect(await element(by.id('example1-listbuilder-listview-item-4')).getAttribute('id')).toEqual('example1-listbuilder-listview-item-4');
    expect(await element(by.id('example1-listbuilder-listview-item-4')).getAttribute('data-automation-id')).toEqual('automation-id-example1-listbuilder-listview-item-4');
    expect(await element(by.id('example1-listbuilder-listview-item-5')).getAttribute('id')).toEqual('example1-listbuilder-listview-item-5');
    expect(await element(by.id('example1-listbuilder-listview-item-5')).getAttribute('data-automation-id')).toEqual('automation-id-example1-listbuilder-listview-item-5');
    expect(await element(by.id('example1-listbuilder-listview-item-6')).getAttribute('id')).toEqual('example1-listbuilder-listview-item-6');
    expect(await element(by.id('example1-listbuilder-listview-item-6')).getAttribute('data-automation-id')).toEqual('automation-id-example1-listbuilder-listview-item-6');
    expect(await element(by.id('example1-listbuilder-listview-item-7')).getAttribute('id')).toEqual('example1-listbuilder-listview-item-7');
    expect(await element(by.id('example1-listbuilder-listview-item-7')).getAttribute('data-automation-id')).toEqual('automation-id-example1-listbuilder-listview-item-7');
    expect(await element(by.id('example1-listbuilder-listview-item-8')).getAttribute('id')).toEqual('example1-listbuilder-listview-item-8');
    expect(await element(by.id('example1-listbuilder-listview-item-8')).getAttribute('data-automation-id')).toEqual('automation-id-example1-listbuilder-listview-item-8');
    expect(await element(by.id('example1-listbuilder-listview-item-9')).getAttribute('id')).toEqual('example1-listbuilder-listview-item-9');
    expect(await element(by.id('example1-listbuilder-listview-item-9')).getAttribute('data-automation-id')).toEqual('automation-id-example1-listbuilder-listview-item-9');
    expect(await element(by.id('example1-listbuilder-listview-item-10')).getAttribute('id')).toEqual('example1-listbuilder-listview-item-10');
    expect(await element(by.id('example1-listbuilder-listview-item-10')).getAttribute('data-automation-id')).toEqual('automation-id-example1-listbuilder-listview-item-10');
    expect(await element(by.id('example1-listbuilder-listview-item-11')).getAttribute('id')).toEqual('example1-listbuilder-listview-item-11');
    expect(await element(by.id('example1-listbuilder-listview-item-11')).getAttribute('data-automation-id')).toEqual('automation-id-example1-listbuilder-listview-item-11');
  });
});

describe('Listbuilder Update Dataset Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/listbuilder/test-update-dataset');
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(await element(by.id('example-listbuilder'))), config.waitsFor);
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should update dataset', async () => {
    expect(await element.all(by.css('li[role="option"]')).count()).toEqual(12);
    await element(await by.id('btn1')).click();

    expect(await element.all(by.css('li[role="option"]')).count()).toEqual(3);
  });
});
