const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Rating example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/rating/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('rating')).toEqual(0);
    });
  }

  it('Should be able to set ids/automation ids', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('rating-id-1')).getAttribute('id')).toEqual('rating-id-1');
    expect(await element(by.id('rating-id-1')).getAttribute('data-automation-id')).toEqual('rating-automation-id-1');

    expect(await element(by.id('one-star-id1')).getAttribute('id')).toEqual('one-star-id1');
    expect(await element(by.id('one-star-id1')).getAttribute('data-automation-id')).toEqual('one-star-automation-id1');

    expect(await element(by.id('two-star-id1')).getAttribute('id')).toEqual('two-star-id1');
    expect(await element(by.id('two-star-id1')).getAttribute('data-automation-id')).toEqual('two-star-automation-id1');

    expect(await element(by.id('three-star-id1')).getAttribute('id')).toEqual('three-star-id1');
    expect(await element(by.id('three-star-id1')).getAttribute('data-automation-id')).toEqual('three-star-automation-id1');

    expect(await element(by.id('four-star-id1')).getAttribute('id')).toEqual('four-star-id1');
    expect(await element(by.id('four-star-id1')).getAttribute('data-automation-id')).toEqual('four-star-automation-id1');

    expect(await element(by.id('five-star-id1')).getAttribute('id')).toEqual('five-star-id1');
    expect(await element(by.id('five-star-id1')).getAttribute('data-automation-id')).toEqual('five-star-automation-id1');
  });
});
