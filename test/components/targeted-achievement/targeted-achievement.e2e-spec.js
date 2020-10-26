const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Targeted Achievement example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/targeted-achievement/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to set id/automation id example one', async () => {
    expect(await element(by.id('targeted-achievement-example1-name')).getAttribute('id')).toEqual('targeted-achievement-example1-name');
    expect(await element(by.id('targeted-achievement-example1-name')).getAttribute('data-automation-id')).toEqual('automation-id-targeted-achievement-example1-name');

    expect(await element(by.id('targeted-achievement-example1-total-value')).getAttribute('id')).toEqual('targeted-achievement-example1-total-value');
    expect(await element(by.id('targeted-achievement-example1-total-value')).getAttribute('data-automation-id')).toEqual('automation-id-targeted-achievement-example1-total-value');

    expect(await element(by.id('targeted-achievement-example1-total-bar')).getAttribute('id')).toEqual('targeted-achievement-example1-total-bar');
    expect(await element(by.id('targeted-achievement-example1-total-bar')).getAttribute('data-automation-id')).toEqual('automation-id-targeted-achievement-example1-total-bar');

    expect(await element(by.id('targeted-achievement-example1-remaining-bar')).getAttribute('id')).toEqual('targeted-achievement-example1-remaining-bar');
    expect(await element(by.id('targeted-achievement-example1-remaining-bar')).getAttribute('data-automation-id')).toEqual('automation-id-targeted-achievement-example1-remaining-bar');

    expect(await element(by.id('targeted-achievement-example1-completed-bar')).getAttribute('id')).toEqual('targeted-achievement-example1-completed-bar');
    expect(await element(by.id('targeted-achievement-example1-completed-bar')).getAttribute('data-automation-id')).toEqual('automation-id-targeted-achievement-example1-completed-bar');
    expect(await element(by.id('targeted-achievement-example1-completed-text')).getAttribute('id')).toEqual('targeted-achievement-example1-completed-text');
    expect(await element(by.id('targeted-achievement-example1-completed-text')).getAttribute('data-automation-id')).toEqual('automation-id-targeted-achievement-example1-completed-text');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkScreen('targeted-achievement')).toEqual(0);
    });
  }
});

describe('Targeted Achievement icons and links tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/targeted-achievement/example-links-icons?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleepLonger);

      expect(await browser.imageComparison.checkScreen('targeted-achievement-links-icons')).toEqual(0);
    });
  }
});
