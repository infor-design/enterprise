const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Swaplist example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/swaplist/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to set id/automation id example two', async () => {
    expect(await element(by.id('example2-swaplist-btn-available')).getAttribute('id')).toEqual('example2-swaplist-btn-available');
    expect(await element(by.id('example2-swaplist-btn-available')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-btn-available');
    expect(await element(by.id('example2-swaplist-btn-selected-left')).getAttribute('id')).toEqual('example2-swaplist-btn-selected-left');
    expect(await element(by.id('example2-swaplist-btn-selected-left')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-btn-selected-left');
    expect(await element(by.id('example2-swaplist-btn-selected-right')).getAttribute('id')).toEqual('example2-swaplist-btn-selected-right');
    expect(await element(by.id('example2-swaplist-btn-selected-right')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-btn-selected-right');
    expect(await element(by.id('example2-swaplist-btn-full-access')).getAttribute('id')).toEqual('example2-swaplist-btn-full-access');
    expect(await element(by.id('example2-swaplist-btn-full-access')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-btn-full-access');

    expect(await element(by.id('example2-swaplist-available-listview')).getAttribute('id')).toEqual('example2-swaplist-available-listview');
    expect(await element(by.id('example2-swaplist-available-listview')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-available-listview');
    expect(await element(by.id('example2-swaplist-selected-listview')).getAttribute('id')).toEqual('example2-swaplist-selected-listview');
    expect(await element(by.id('example2-swaplist-selected-listview')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-selected-listview');
    expect(await element(by.id('example2-swaplist-full-access-listview')).getAttribute('id')).toEqual('example2-swaplist-full-access-listview');
    expect(await element(by.id('example2-swaplist-full-access-listview')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-full-access-listview');

    expect(await element(by.id('example2-swaplist-available-listview-item-0')).getAttribute('id')).toEqual('example2-swaplist-available-listview-item-0');
    expect(await element(by.id('example2-swaplist-available-listview-item-0')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-available-listview-item-0');
    expect(await element(by.id('example2-swaplist-available-listview-item-1')).getAttribute('id')).toEqual('example2-swaplist-available-listview-item-1');
    expect(await element(by.id('example2-swaplist-available-listview-item-1')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-available-listview-item-1');
    expect(await element(by.id('example2-swaplist-available-listview-item-2')).getAttribute('id')).toEqual('example2-swaplist-available-listview-item-2');
    expect(await element(by.id('example2-swaplist-available-listview-item-2')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-available-listview-item-2');
    expect(await element(by.id('example2-swaplist-available-listview-item-3')).getAttribute('id')).toEqual('example2-swaplist-available-listview-item-3');
    expect(await element(by.id('example2-swaplist-available-listview-item-3')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-available-listview-item-3');
    expect(await element(by.id('example2-swaplist-available-listview-item-4')).getAttribute('id')).toEqual('example2-swaplist-available-listview-item-4');
    expect(await element(by.id('example2-swaplist-available-listview-item-4')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-available-listview-item-4');
    expect(await element(by.id('example2-swaplist-available-listview-item-5')).getAttribute('id')).toEqual('example2-swaplist-available-listview-item-5');
    expect(await element(by.id('example2-swaplist-available-listview-item-5')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-available-listview-item-5');
    expect(await element(by.id('example2-swaplist-available-listview-item-6')).getAttribute('id')).toEqual('example2-swaplist-available-listview-item-6');
    expect(await element(by.id('example2-swaplist-available-listview-item-6')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-available-listview-item-6');

    expect(await element(by.id('example2-swaplist-selected-listview-item-0')).getAttribute('id')).toEqual('example2-swaplist-selected-listview-item-0');
    expect(await element(by.id('example2-swaplist-selected-listview-item-0')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-selected-listview-item-0');
    expect(await element(by.id('example2-swaplist-selected-listview-item-1')).getAttribute('id')).toEqual('example2-swaplist-selected-listview-item-1');
    expect(await element(by.id('example2-swaplist-selected-listview-item-1')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-selected-listview-item-1');
    expect(await element(by.id('example2-swaplist-selected-listview-item-2')).getAttribute('id')).toEqual('example2-swaplist-selected-listview-item-2');
    expect(await element(by.id('example2-swaplist-selected-listview-item-2')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-selected-listview-item-2');

    expect(await element(by.id('example2-swaplist-full-access-listview-item-0')).getAttribute('id')).toEqual('example2-swaplist-full-access-listview-item-0');
    expect(await element(by.id('example2-swaplist-full-access-listview-item-0')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-full-access-listview-item-0');
    expect(await element(by.id('example2-swaplist-full-access-listview-item-1')).getAttribute('id')).toEqual('example2-swaplist-full-access-listview-item-1');
    expect(await element(by.id('example2-swaplist-full-access-listview-item-1')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-full-access-listview-item-1');
    expect(await element(by.id('example2-swaplist-full-access-listview-item-2')).getAttribute('id')).toEqual('example2-swaplist-full-access-listview-item-2');
    expect(await element(by.id('example2-swaplist-full-access-listview-item-2')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-full-access-listview-item-2');
    expect(await element(by.id('example2-swaplist-full-access-listview-item-3')).getAttribute('id')).toEqual('example2-swaplist-full-access-listview-item-3');
    expect(await element(by.id('example2-swaplist-full-access-listview-item-3')).getAttribute('data-automation-id')).toEqual('automation-id-example2-swaplist-full-access-listview-item-3');
  });
});
