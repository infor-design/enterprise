const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Radar example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/radar/example-index?theme=classic&layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to set id/automation id', async () => {
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('radar-iphone-battery-life-circle')).getAttribute('id')).toEqual('radar-iphone-battery-life-circle');
    expect(await element(by.id('radar-iphone-battery-life-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-iphone-battery-life-circle');
    expect(await element(by.id('radar-iphone-brand-circle')).getAttribute('id')).toEqual('radar-iphone-brand-circle');
    expect(await element(by.id('radar-iphone-brand-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-iphone-brand-circle');
    expect(await element(by.id('radar-iphone-cost-circle')).getAttribute('id')).toEqual('radar-iphone-cost-circle');
    expect(await element(by.id('radar-iphone-cost-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-iphone-cost-circle');
    expect(await element(by.id('radar-iphone-design-circle')).getAttribute('id')).toEqual('radar-iphone-design-circle');
    expect(await element(by.id('radar-iphone-design-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-iphone-design-circle');
    expect(await element(by.id('radar-iphone-connectivity-circle')).getAttribute('id')).toEqual('radar-iphone-connectivity-circle');
    expect(await element(by.id('radar-iphone-connectivity-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-iphone-connectivity-circle');
    expect(await element(by.id('radar-iphone-screen-circle')).getAttribute('id')).toEqual('radar-iphone-screen-circle');
    expect(await element(by.id('radar-iphone-screen-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-iphone-screen-circle');
    expect(await element(by.id('radar-iphone-price-circle')).getAttribute('id')).toEqual('radar-iphone-price-circle');
    expect(await element(by.id('radar-iphone-price-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-iphone-price-circle');

    expect(await element(by.id('radar-samsung-battery-life-circle')).getAttribute('id')).toEqual('radar-samsung-battery-life-circle');
    expect(await element(by.id('radar-samsung-battery-life-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-samsung-battery-life-circle');
    expect(await element(by.id('radar-samsung-brand-circle')).getAttribute('id')).toEqual('radar-samsung-brand-circle');
    expect(await element(by.id('radar-samsung-brand-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-samsung-brand-circle');
    expect(await element(by.id('radar-samsung-cost-circle')).getAttribute('id')).toEqual('radar-samsung-cost-circle');
    expect(await element(by.id('radar-samsung-cost-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-samsung-cost-circle');
    expect(await element(by.id('radar-samsung-design-circle')).getAttribute('id')).toEqual('radar-samsung-design-circle');
    expect(await element(by.id('radar-samsung-design-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-samsung-design-circle');
    expect(await element(by.id('radar-samsung-connectivity-circle')).getAttribute('id')).toEqual('radar-samsung-connectivity-circle');
    expect(await element(by.id('radar-samsung-connectivity-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-samsung-connectivity-circle');
    expect(await element(by.id('radar-samsung-screen-circle')).getAttribute('id')).toEqual('radar-samsung-screen-circle');
    expect(await element(by.id('radar-nokia-screen-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-nokia-screen-circle');
    expect(await element(by.id('radar-nokia-price-circle')).getAttribute('id')).toEqual('radar-nokia-price-circle');
    expect(await element(by.id('radar-nokia-price-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-nokia-price-circle');

    expect(await element(by.id('radar-nokia-battery-life-circle')).getAttribute('id')).toEqual('radar-nokia-battery-life-circle');
    expect(await element(by.id('radar-nokia-battery-life-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-nokia-battery-life-circle');
    expect(await element(by.id('radar-nokia-brand-circle')).getAttribute('id')).toEqual('radar-nokia-brand-circle');
    expect(await element(by.id('radar-nokia-brand-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-nokia-brand-circle');
    expect(await element(by.id('radar-nokia-cost-circle')).getAttribute('id')).toEqual('radar-nokia-cost-circle');
    expect(await element(by.id('radar-nokia-cost-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-nokia-cost-circle');
    expect(await element(by.id('radar-nokia-design-circle')).getAttribute('id')).toEqual('radar-nokia-design-circle');
    expect(await element(by.id('radar-nokia-design-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-nokia-design-circle');
    expect(await element(by.id('radar-nokia-connectivity-circle')).getAttribute('id')).toEqual('radar-nokia-connectivity-circle');
    expect(await element(by.id('radar-nokia-connectivity-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-nokia-connectivity-circle');
    expect(await element(by.id('radar-nokia-screen-circle')).getAttribute('id')).toEqual('radar-nokia-screen-circle');
    expect(await element(by.id('radar-nokia-screen-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-nokia-screen-circle');
    expect(await element(by.id('radar-nokia-price-circle')).getAttribute('id')).toEqual('radar-nokia-price-circle');
    expect(await element(by.id('radar-nokia-price-circle')).getAttribute('data-automation-id')).toEqual('automation-id-radar-nokia-price-circle');

    expect(await element(by.id('radar-iphone-area')).getAttribute('id')).toEqual('radar-iphone-area');
    expect(await element(by.id('radar-iphone-area')).getAttribute('data-automation-id')).toEqual('automation-id-radar-iphone-area');
    expect(await element(by.id('radar-samsung-area')).getAttribute('id')).toEqual('radar-samsung-area');
    expect(await element(by.id('radar-samsung-area')).getAttribute('data-automation-id')).toEqual('automation-id-radar-samsung-area');
    expect(await element(by.id('radar-nokia-area')).getAttribute('id')).toEqual('radar-nokia-area');
    expect(await element(by.id('radar-nokia-area')).getAttribute('data-automation-id')).toEqual('automation-id-radar-nokia-area');

    expect(await element(by.id('radar-iphone-stroke')).getAttribute('id')).toEqual('radar-iphone-stroke');
    expect(await element(by.id('radar-iphone-stroke')).getAttribute('data-automation-id')).toEqual('automation-id-radar-iphone-stroke');
    expect(await element(by.id('radar-samsung-stroke')).getAttribute('id')).toEqual('radar-samsung-stroke');
    expect(await element(by.id('radar-samsung-stroke')).getAttribute('data-automation-id')).toEqual('automation-id-radar-samsung-stroke');
    expect(await element(by.id('radar-nokia-stroke')).getAttribute('id')).toEqual('radar-nokia-stroke');
    expect(await element(by.id('radar-nokia-stroke')).getAttribute('data-automation-id')).toEqual('automation-id-radar-nokia-stroke');

    expect(await element(by.id('radar-iphone-legend')).getAttribute('id')).toEqual('radar-iphone-legend');
    expect(await element(by.id('radar-iphone-legend')).getAttribute('data-automation-id')).toEqual('automation-id-radar-iphone-legend');
    expect(await element(by.id('radar-samsung-legend')).getAttribute('id')).toEqual('radar-samsung-legend');
    expect(await element(by.id('radar-samsung-legend')).getAttribute('data-automation-id')).toEqual('automation-id-radar-samsung-legend');
    expect(await element(by.id('radar-nokia-legend')).getAttribute('id')).toEqual('radar-nokia-legend');
    expect(await element(by.id('radar-nokia-legend')).getAttribute('data-automation-id')).toEqual('automation-id-radar-nokia-legend');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.css('div[role=main]'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(containerEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkScreen('radar')).toEqual(0);
    });
  }
});
