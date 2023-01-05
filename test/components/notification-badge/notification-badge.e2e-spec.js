const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');

describe('Notification Badge example-badge-placement tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/notification-badge/example-badge-placement?layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    xit('should not visual regress', async () => {
      const containerEl = await element(by.className('container'));

      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'notification-badge-placement')).toEqual(0);
    });
  }

  it('Should be able to set id\'s/automation id\'s', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('notification-badge-id-1-container')).getAttribute('id')).toEqual('notification-badge-id-1-container');
    expect(await element(by.id('notification-badge-id-1-container')).getAttribute('data-automation-id')).toEqual('notification-badge-automation-id-1-container');
    expect(await element(by.id('notification-badge-id-1-dot')).getAttribute('id')).toEqual('notification-badge-id-1-dot');
    expect(await element(by.id('notification-badge-id-1-dot')).getAttribute('data-automation-id')).toEqual('notification-badge-automation-id-1-dot');

    expect(await element(by.id('notification-badge-id-2-container')).getAttribute('id')).toEqual('notification-badge-id-2-container');
    expect(await element(by.id('notification-badge-id-2-container')).getAttribute('data-automation-id')).toEqual('notification-badge-automation-id-2-container');
    expect(await element(by.id('notification-badge-id-2-dot')).getAttribute('id')).toEqual('notification-badge-id-2-dot');
    expect(await element(by.id('notification-badge-id-2-dot')).getAttribute('data-automation-id')).toEqual('notification-badge-automation-id-2-dot');

    expect(await element(by.id('notification-badge-id-3-container')).getAttribute('id')).toEqual('notification-badge-id-3-container');
    expect(await element(by.id('notification-badge-id-3-container')).getAttribute('data-automation-id')).toEqual('notification-badge-automation-id-3-container');
    expect(await element(by.id('notification-badge-id-3-dot')).getAttribute('id')).toEqual('notification-badge-id-3-dot');
    expect(await element(by.id('notification-badge-id-3-dot')).getAttribute('data-automation-id')).toEqual('notification-badge-automation-id-3-dot');

    expect(await element(by.id('notification-badge-id-4-container')).getAttribute('id')).toEqual('notification-badge-id-4-container');
    expect(await element(by.id('notification-badge-id-4-container')).getAttribute('data-automation-id')).toEqual('notification-badge-automation-id-4-container');
    expect(await element(by.id('notification-badge-id-4-dot')).getAttribute('id')).toEqual('notification-badge-id-4-dot');
    expect(await element(by.id('notification-badge-id-4-dot')).getAttribute('data-automation-id')).toEqual('notification-badge-automation-id-4-dot');

    expect(await element(by.id('notification-badge-id-5-container')).getAttribute('id')).toEqual('notification-badge-id-5-container');
    expect(await element(by.id('notification-badge-id-5-container')).getAttribute('data-automation-id')).toEqual('notification-badge-automation-id-5-container');
    expect(await element(by.id('notification-badge-id-5-dot')).getAttribute('id')).toEqual('notification-badge-id-5-dot');
    expect(await element(by.id('notification-badge-id-5-dot')).getAttribute('data-automation-id')).toEqual('notification-badge-automation-id-5-dot');

    expect(await element(by.id('notification-badge-id-6-container')).getAttribute('id')).toEqual('notification-badge-id-6-container');
    expect(await element(by.id('notification-badge-id-6-container')).getAttribute('data-automation-id')).toEqual('notification-badge-automation-id-6-container');
    expect(await element(by.id('notification-badge-id-6-dot')).getAttribute('id')).toEqual('notification-badge-id-6-dot');
    expect(await element(by.id('notification-badge-id-6-dot')).getAttribute('data-automation-id')).toEqual('notification-badge-automation-id-6-dot');
  });
});
