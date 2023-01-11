const utils = requireHelper('e2e-utils');
requireHelper('rejection');

describe('Sparkline example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/sparkline/example-index?layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should be able to set id/automation id example one', async () => {
    expect(await element(by.id('sparkline1-connected-line')).getAttribute('id')).toEqual('sparkline1-connected-line');
    expect(await element(by.id('sparkline1-connected-line')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline1-connected-line');

    expect(await element(by.id('sparkline1-point-0')).getAttribute('id')).toEqual('sparkline1-point-0');
    expect(await element(by.id('sparkline1-point-0')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline1-point-0');
    expect(await element(by.id('sparkline1-point-1')).getAttribute('id')).toEqual('sparkline1-point-1');
    expect(await element(by.id('sparkline1-point-1')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline1-point-1');
    expect(await element(by.id('sparkline1-point-2')).getAttribute('id')).toEqual('sparkline1-point-2');
    expect(await element(by.id('sparkline1-point-2')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline1-point-2');
    expect(await element(by.id('sparkline1-point-3')).getAttribute('id')).toEqual('sparkline1-point-3');
    expect(await element(by.id('sparkline1-point-3')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline1-point-3');
    expect(await element(by.id('sparkline1-point-4')).getAttribute('id')).toEqual('sparkline1-point-4');
    expect(await element(by.id('sparkline1-point-4')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline1-point-4');
    expect(await element(by.id('sparkline1-point-5')).getAttribute('id')).toEqual('sparkline1-point-5');
    expect(await element(by.id('sparkline1-point-5')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline1-point-5');
    expect(await element(by.id('sparkline1-point-6')).getAttribute('id')).toEqual('sparkline1-point-6');
    expect(await element(by.id('sparkline1-point-6')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline1-point-6');
    expect(await element(by.id('sparkline1-point-7')).getAttribute('id')).toEqual('sparkline1-point-7');
    expect(await element(by.id('sparkline1-point-7')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline1-point-7');
    expect(await element(by.id('sparkline1-point-8')).getAttribute('id')).toEqual('sparkline1-point-8');
    expect(await element(by.id('sparkline1-point-8')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline1-point-8');
    expect(await element(by.id('sparkline1-point-9')).getAttribute('id')).toEqual('sparkline1-point-9');
    expect(await element(by.id('sparkline1-point-9')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline1-point-9');
  });

  it('should be able to set id/automation id example two', async () => {
    expect(await element(by.id('sparkline2-inventory-connected-line')).getAttribute('id')).toEqual('sparkline2-inventory-connected-line');
    expect(await element(by.id('sparkline2-inventory-connected-line')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline2-inventory-connected-line');

    expect(await element(by.id('sparkline2-demand-connected-line')).getAttribute('id')).toEqual('sparkline2-demand-connected-line');
    expect(await element(by.id('sparkline2-demand-connected-line')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline2-demand-connected-line');

    expect(await element(by.id('sparkline2-inventory-point-0')).getAttribute('id')).toEqual('sparkline2-inventory-point-0');
    expect(await element(by.id('sparkline2-inventory-point-0')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline2-inventory-point-0');
    expect(await element(by.id('sparkline2-inventory-point-1')).getAttribute('id')).toEqual('sparkline2-inventory-point-1');
    expect(await element(by.id('sparkline2-inventory-point-1')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline2-inventory-point-1');
    expect(await element(by.id('sparkline2-inventory-point-2')).getAttribute('id')).toEqual('sparkline2-inventory-point-2');
    expect(await element(by.id('sparkline2-inventory-point-2')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline2-inventory-point-2');
    expect(await element(by.id('sparkline2-inventory-point-3')).getAttribute('id')).toEqual('sparkline2-inventory-point-3');
    expect(await element(by.id('sparkline2-inventory-point-3')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline2-inventory-point-3');
    expect(await element(by.id('sparkline2-inventory-point-4')).getAttribute('id')).toEqual('sparkline2-inventory-point-4');
    expect(await element(by.id('sparkline2-inventory-point-4')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline2-inventory-point-4');
    expect(await element(by.id('sparkline2-inventory-point-5')).getAttribute('id')).toEqual('sparkline2-inventory-point-5');
    expect(await element(by.id('sparkline2-inventory-point-5')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline2-inventory-point-5');
    expect(await element(by.id('sparkline2-inventory-point-6')).getAttribute('id')).toEqual('sparkline2-inventory-point-6');
    expect(await element(by.id('sparkline2-inventory-point-6')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline2-inventory-point-6');
    expect(await element(by.id('sparkline2-inventory-point-7')).getAttribute('id')).toEqual('sparkline2-inventory-point-7');
    expect(await element(by.id('sparkline2-inventory-point-7')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline2-inventory-point-7');
    expect(await element(by.id('sparkline2-inventory-point-8')).getAttribute('id')).toEqual('sparkline2-inventory-point-8');
    expect(await element(by.id('sparkline2-inventory-point-8')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline2-inventory-point-8');
    expect(await element(by.id('sparkline2-inventory-point-9')).getAttribute('id')).toEqual('sparkline2-inventory-point-9');
    expect(await element(by.id('sparkline2-inventory-point-9')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline2-inventory-point-9');
  });

  it('should be able to set id/automation id example three', async () => {
    expect(await element(by.id('sparkline3-medianrange')).getAttribute('id')).toEqual('sparkline3-medianrange');
    expect(await element(by.id('sparkline3-medianrange')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline3-medianrange');

    expect(await element(by.id('sparkline3-connected-line')).getAttribute('id')).toEqual('sparkline3-connected-line');
    expect(await element(by.id('sparkline3-connected-line')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline3-connected-line');

    expect(await element(by.id('sparkline3-point-0')).getAttribute('id')).toEqual('sparkline3-point-0');
    expect(await element(by.id('sparkline3-point-0')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline3-point-0');
    expect(await element(by.id('sparkline3-point-1')).getAttribute('id')).toEqual('sparkline3-point-1');
    expect(await element(by.id('sparkline3-point-1')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline3-point-1');
    expect(await element(by.id('sparkline3-point-2')).getAttribute('id')).toEqual('sparkline3-point-2');
    expect(await element(by.id('sparkline3-point-2')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline3-point-2');
    expect(await element(by.id('sparkline3-point-3')).getAttribute('id')).toEqual('sparkline3-point-3');
    expect(await element(by.id('sparkline3-point-3')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline3-point-3');
    expect(await element(by.id('sparkline3-point-4')).getAttribute('id')).toEqual('sparkline3-point-4');
    expect(await element(by.id('sparkline3-point-4')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline3-point-4');
    expect(await element(by.id('sparkline3-point-5')).getAttribute('id')).toEqual('sparkline3-point-5');
    expect(await element(by.id('sparkline3-point-5')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline3-point-5');
    expect(await element(by.id('sparkline3-point-6')).getAttribute('id')).toEqual('sparkline3-point-6');
    expect(await element(by.id('sparkline3-point-6')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline3-point-6');
    expect(await element(by.id('sparkline3-point-7')).getAttribute('id')).toEqual('sparkline3-point-7');
    expect(await element(by.id('sparkline3-point-7')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline3-point-7');
    expect(await element(by.id('sparkline3-point-8')).getAttribute('id')).toEqual('sparkline3-point-8');
    expect(await element(by.id('sparkline3-point-8')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline3-point-8');
    expect(await element(by.id('sparkline3-point-9')).getAttribute('id')).toEqual('sparkline3-point-9');
    expect(await element(by.id('sparkline3-point-9')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline3-point-9');
  });

  it('should be able to set id/automation id example four', async () => {
    expect(await element(by.id('sparkline4-connected-line')).getAttribute('id')).toEqual('sparkline4-connected-line');
    expect(await element(by.id('sparkline4-connected-line')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline4-connected-line');

    expect(await element(by.id('sparkline4-point-0')).getAttribute('id')).toEqual('sparkline4-point-0');
    expect(await element(by.id('sparkline4-point-0')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline4-point-0');
    expect(await element(by.id('sparkline4-point-1')).getAttribute('id')).toEqual('sparkline4-point-1');
    expect(await element(by.id('sparkline4-point-1')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline4-point-1');
    expect(await element(by.id('sparkline4-point-2')).getAttribute('id')).toEqual('sparkline4-point-2');
    expect(await element(by.id('sparkline4-point-2')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline4-point-2');
    expect(await element(by.id('sparkline4-point-3')).getAttribute('id')).toEqual('sparkline4-point-3');
    expect(await element(by.id('sparkline4-point-3')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline4-point-3');
    expect(await element(by.id('sparkline4-point-4')).getAttribute('id')).toEqual('sparkline4-point-4');
    expect(await element(by.id('sparkline4-point-4')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline4-point-4');
    expect(await element(by.id('sparkline4-point-5')).getAttribute('id')).toEqual('sparkline4-point-5');
    expect(await element(by.id('sparkline4-point-5')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline4-point-5');
    expect(await element(by.id('sparkline4-point-6')).getAttribute('id')).toEqual('sparkline4-point-6');
    expect(await element(by.id('sparkline4-point-6')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline4-point-6');
    expect(await element(by.id('sparkline4-point-7')).getAttribute('id')).toEqual('sparkline4-point-7');
    expect(await element(by.id('sparkline4-point-7')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline4-point-7');
    expect(await element(by.id('sparkline4-point-8')).getAttribute('id')).toEqual('sparkline4-point-8');
    expect(await element(by.id('sparkline4-point-8')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline4-point-8');
    expect(await element(by.id('sparkline4-point-9')).getAttribute('id')).toEqual('sparkline4-point-9');
    expect(await element(by.id('sparkline4-point-9')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline4-point-9');
  });

  it('should be able to set id/automation id example five', async () => {
    expect(await element(by.id('sparkline5-connected-line')).getAttribute('id')).toEqual('sparkline5-connected-line');
    expect(await element(by.id('sparkline5-connected-line')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline5-connected-line');

    expect(await element(by.id('sparkline5-point-0')).getAttribute('id')).toEqual('sparkline5-point-0');
    expect(await element(by.id('sparkline5-point-0')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline5-point-0');
    expect(await element(by.id('sparkline5-point-1')).getAttribute('id')).toEqual('sparkline5-point-1');
    expect(await element(by.id('sparkline5-point-1')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline5-point-1');
    expect(await element(by.id('sparkline5-point-2')).getAttribute('id')).toEqual('sparkline5-point-2');
    expect(await element(by.id('sparkline5-point-2')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline5-point-2');
    expect(await element(by.id('sparkline5-point-3')).getAttribute('id')).toEqual('sparkline5-point-3');
    expect(await element(by.id('sparkline5-point-3')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline5-point-3');
    expect(await element(by.id('sparkline5-point-4')).getAttribute('id')).toEqual('sparkline5-point-4');
    expect(await element(by.id('sparkline5-point-4')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline5-point-4');
    expect(await element(by.id('sparkline5-point-5')).getAttribute('id')).toEqual('sparkline5-point-5');
    expect(await element(by.id('sparkline5-point-5')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline5-point-5');
    expect(await element(by.id('sparkline5-point-6')).getAttribute('id')).toEqual('sparkline5-point-6');
    expect(await element(by.id('sparkline5-point-6')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline5-point-6');
    expect(await element(by.id('sparkline5-point-7')).getAttribute('id')).toEqual('sparkline5-point-7');
    expect(await element(by.id('sparkline5-point-7')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline5-point-7');
    expect(await element(by.id('sparkline5-point-8')).getAttribute('id')).toEqual('sparkline5-point-8');
    expect(await element(by.id('sparkline5-point-8')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline5-point-8');
    expect(await element(by.id('sparkline5-point-9')).getAttribute('id')).toEqual('sparkline5-point-9');
    expect(await element(by.id('sparkline5-point-9')).getAttribute('data-automation-id')).toEqual('automation-id-sparkline5-point-9');
  });
});
