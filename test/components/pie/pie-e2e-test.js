const utils = requireHelper('e2e-utils');
requireHelper('rejection');

describe('Pie Chart tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/pie/example-index?theme=classic&layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should be able to set id/automation id', async () => {
    expect(await element(by.id('item-a-slice-0')).getAttribute('id')).toEqual('item-a-slice-0');
    expect(await element(by.id('item-a-slice-0')).getAttribute('data-automation-id')).toEqual('item-a-automation-id-slice-0');
    expect(await element(by.id('item-a-legend-0')).getAttribute('id')).toEqual('item-a-legend-0');
    expect(await element(by.id('item-a-legend-0')).getAttribute('data-automation-id')).toEqual('item-a-automation-id-legend-0');
  });
});
