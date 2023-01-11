const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

describe('Notification example-index test', () => {
  beforeEach(async () => {
    await utils.setPage('/components/notification/example-index?theme=classic&layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('notification')).toEqual(0);
    });
  }

  it('should be able to set ids/automation ids', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('notification-id-4')).getAttribute('id')).toEqual('notification-id-4');
    expect(await element(by.id('notification-id-4')).getAttribute('data-automation-id')).toEqual('notification-automation-id-4');

    expect(await element(by.id('notification-id-3')).getAttribute('id')).toEqual('notification-id-3');
    expect(await element(by.id('notification-id-3')).getAttribute('data-automation-id')).toEqual('notification-automation-id-3');

    expect(await element(by.id('notification-id-2')).getAttribute('id')).toEqual('notification-id-2');
    expect(await element(by.id('notification-id-2')).getAttribute('data-automation-id')).toEqual('notification-automation-id-2');

    expect(await element(by.id('notification-id-1')).getAttribute('id')).toEqual('notification-id-1');
    expect(await element(by.id('notification-id-1')).getAttribute('data-automation-id')).toEqual('notification-automation-id-1');
  });
});
