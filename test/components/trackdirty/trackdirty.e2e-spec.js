const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Track Dirty Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/input/example-index?nofrills=true');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should trigger and reset dirty', async () => {
    expect(await element(await by.id('department-code-trackdirty')).getAttribute('value')).toBeFalsy();
    await element(await by.id('department-code-trackdirty')).sendKeys('9090');
    await element(await by.id('department-code-trackdirty')).sendKeys(protractor.Key.TAB);

    expect(await element.all(await by.css('.icon-dirty')).count()).toEqual(1);
    expect(await element(await by.id('department-code-trackdirty')).getAttribute('class')).toContain('dirty');

    await element(await by.id('department-code-trackdirty')).clear();
    await element(await by.id('department-code-trackdirty')).sendKeys(protractor.Key.TAB);

    expect(await element.all(await by.css('.icon-dirty')).count()).toEqual(0);
    expect(await element(await by.id('department-code-trackdirty')).getAttribute('class')).not.toContain('dirty');
  });
});
