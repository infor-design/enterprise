const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Editor example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/editor/example-index?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should be able to edit in both modes', async () => {
    const elem = await element(by.css('.editor'));

    await elem.clear();
    await elem.sendKeys('Test');
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.editor')).getText()).toEqual('Test');
    await browser.driver.sleep(config.sleep);
    await element(by.css('button[data-action=source]')).click();
    await browser.driver.sleep(config.sleep);

    const sourceElem = await element(by.tagName('textarea'));
    const testText = await sourceElem.getText();

    expect(testText.replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('Test');

    await sourceElem.sendKeys('<b>Test</b>');
    await element(by.css('button[data-action=visual]')).click();
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.editor')).getText()).toEqual('TestTest');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const elem = await element(by.css('.editor'));

      await elem.clear();
      await elem.sendKeys('Test');

      await browser.driver.sleep(config.sleep);
      await element(by.css('button[data-action=source]')).click();
      await browser.driver.sleep(config.sleep);

      const sourceElem = await element(by.tagName('textarea'));

      await sourceElem.sendKeys('<b>Test</b>');
      await element(by.css('button[data-action=visual]')).click();
      await browser.driver.sleep(config.sleep);

      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'editor-index')).toEqual(0);
    });
  }
});

describe('Editor preview mode tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/editor/example-preview?layout=nofrills');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should render editor in preview mode', async () => {
    const container = await element(by.css('.editor-container'));
    const elem = await element(by.css('.editor'));

    expect(await container.getAttribute('class')).toContain('is-preview');
    expect(await container.getAttribute('class')).not.toContain('is-disabled');
    expect(await container.getAttribute('class')).not.toContain('is-readonly');
    expect(await elem.getAttribute('class')).not.toContain('is-preview');
    expect(await elem.getAttribute('class')).not.toContain('is-disabled');
    expect(await elem.getAttribute('class')).not.toContain('is-readonly');
    expect(await elem.isDisplayed()).toBeTruthy();
    expect(await elem.getAttribute('contenteditable')).toBe('false');
    expect(await element(by.css('.editor-toolbar')).isPresent()).toBeFalsy();
  });
});
