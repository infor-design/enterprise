const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Editor example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/editor/example-index');
  });

  it('Should be able to edit in both modes', async () => {
    const elem = await element(by.css('.editor'));

    await elem.clear();
    await elem.sendKeys('Test');

    expect(await element(by.css('.editor')).getText()).toEqual('Test');
    await browser.driver.sleep(config.sleep);
    await element(by.css('button[data-action=source]')).click();
    await browser.driver.sleep(config.sleep);

    const sourceElem = await element(by.tagName('textarea'));
    sourceElem.getText().then((text) => {
      expect(text.replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('Test');
    });

    await sourceElem.sendKeys('<b>Test</b>');
    await element(by.css('button[data-action=visual]')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.editor')).getText()).toEqual('TestTest');
  });
});
