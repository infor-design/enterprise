const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

describe('Editor example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/editor/example-index?layout=nofrills');
  });

  it('should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('should be able to edit in both modes', async () => {
    const elem = await element(by.css('.editor'));

    await elem.clear();
    await elem.sendKeys('Test');
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.editor')).getAttribute('innerHTML')).toEqual('<p>Test</p>');
    await browser.driver.sleep(config.sleep);
    await element(by.css('button[data-action=source]')).click();
    await browser.driver.sleep(config.sleep);

    const sourceElem = await element(by.tagName('textarea'));
    let testText = await sourceElem.getText();

    expect(testText.replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('<p>Test</p>');

    await sourceElem.sendKeys('<b>Test</b>');
    await element(by.css('button[data-action=visual]')).click();
    await browser.driver.sleep(config.sleep);
    testText = await element(by.css('.editor')).getText();

    expect(testText.replace(/(\r\n\t|\n|\r\t)/gm, '')).toEqual('TestTest');
  });

  it('should create p tags when cleared', async () => {
    const elem = await element(by.css('.editor'));

    await elem.clear();
    await elem.sendKeys('Test');
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.editor')).getAttribute('innerHTML')).toEqual('<p>Test</p>');
  });

  it('should create p tags when cleared in html view', async () => {
    const elem = await element(by.css('.editor'));

    await element(by.css('button[data-action=source]')).click();
    await browser.driver.sleep(config.sleep);
    const sourceElem = await element(by.tagName('textarea'));
    await sourceElem.clear();
    await element(by.css('button[data-action=visual]')).click();
    await browser.driver.sleep(config.sleep);
    await elem.sendKeys('Test');
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.editor')).getAttribute('innerHTML')).toEqual('<p>Test</p>');
  });

  it('should remove bold, italics on headers', async () => {
    const elem = await element(by.css('.editor'));
    await elem.clear();
    await elem.sendKeys('test test');
    await elem.click();
    await elem.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
    await browser.driver.sleep(config.sleepShort);

    await element(by.css('.fontpicker')).click();
    await element(by.css('a[data-val="header1"]')).click();

    expect(await element(by.css('.editor')).getAttribute('innerHTML')).toContain('<h3>');
  });

  it('should not insert images if the modals are cancelled', async () => {
    const imageBtn = await element(by.css('.editor-toolbar .btn[data-action="image"]'));

    // Open the Image Modal
    await imageBtn.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.editor-modal-image.is-visible'))), config.waitsFor);

    // Press the escape key and wait for the modal to close
    await browser.driver.sleep(config.sleep);
    await browser.driver.actions().sendKeys(protractor.Key.ESCAPE).perform();
    await browser.driver.sleep(config.sleep);
    await browser.driver
      .wait(protractor.ExpectedConditions.invisibilityOf(await element(by.css('.editor-modal-image'))), config.waitsFor);

    // Scan the editor content for image tags and make sure none exist
    expect(await element(by.css('.editor img')).isPresent()).toBeFalsy();
  });

  it('should insert placeholder image if the image button is clicked and modal confirmed', async () => {
    const imageBtn = await element(by.css('.editor-toolbar .btn[data-action="image"]'));

    // Open the Image Modal
    await imageBtn.click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.editor-modal-image.is-visible'))), config.waitsFor);

    // Press the escape key and wait for the modal to close
    await browser.driver.sleep(config.sleep);
    await browser.driver.actions().sendKeys(protractor.Key.ENTER).perform();
    await browser.driver.sleep(config.sleep);
    await browser.driver
      .wait(protractor.ExpectedConditions.invisibilityOf(await element(by.css('.editor-modal-image'))), config.waitsFor);

    // Scan the editor content for image tags and make sure none exist
    // eslint-disable-next-line jasmine/expect-matcher
    expect(await element(by.css('.editor img[src*="/images/placeholder-80x80.png"]')).isPresent());
  });

  it('should update fontpicker\'s displayed text type when the selected text\'s block is modified', async () => {
    const elem = await element(by.css('.editor'));

    // Clear contents and put some fresh text in
    await elem.clear();
    await elem.sendKeys('test test');
    await elem.click();

    // Simulate text selection of just the first word "test"
    await browser.actions()
      .keyDown(protractor.Key.SHIFT)
      .sendKeys(protractor.Key.ARROW_RIGHT)
      .sendKeys(protractor.Key.ARROW_RIGHT)
      .sendKeys(protractor.Key.ARROW_RIGHT)
      .sendKeys(protractor.Key.ARROW_RIGHT)
      .keyUp(protractor.Key.SHIFT)
      .perform();
    await browser.driver.sleep(config.sleepShort);

    // Open the fontpicker and select "Header 1"
    await element(by.css('.fontpicker')).click();
    await element(by.css('a[data-val="header1"]')).click();

    // Check that the <h3> was applied, and the text inside the fontpicker is up to date.
    expect(await element(by.css('.editor')).getAttribute('innerHTML')).toEqual('<h3>test test</h3>');
    expect(await element(by.css('.fontpicker')).getText()).toEqual('Header 1');
  });

  it('should be able to set id/automation id example', async () => {
    expect(await element(by.id('example1-editor-fontpicker-option-0-menu-item')).getAttribute('id')).toEqual('example1-editor-fontpicker-option-0-menu-item');
    expect(await element(by.id('example1-editor-fontpicker-option-0-menu-item')).getAttribute('data-automation-id')).toEqual('automation-id-example1-editor-fontpicker-option-0-menu-item');

    expect(await element(by.id('example1-editor-toolbar-button-1')).getAttribute('id')).toEqual('example1-editor-toolbar-button-1');
    expect(await element(by.id('example1-editor-toolbar-button-1')).getAttribute('data-automation-id')).toEqual('automation-id-example1-editor-toolbar-button-1');

    await element(by.css('.btn-editor[data-action="foreColor"]')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.popupmenu.colorpicker.is-open'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('example1-editor-toolbar-colorpicker-5-slate10')).getAttribute('id')).toEqual('example1-editor-toolbar-colorpicker-5-slate10');
    expect(await element(by.id('example1-editor-toolbar-colorpicker-5-slate10')).getAttribute('data-automation-id')).toEqual('automation-id-example1-editor-toolbar-colorpicker-5-slate10');

    await element(by.css('.btn-editor[data-action="anchor"]')).click();
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element(by.css('.editor-modal-url.is-visible'))), config.waitsFor);
    await browser.driver.sleep(config.sleep);

    expect(await element(by.id('example1-editor-modal-input0')).getAttribute('id')).toEqual('example1-editor-modal-input0');
    expect(await element(by.id('example1-editor-modal-input0')).getAttribute('data-automation-id')).toEqual('automation-id-example1-editor-modal-input0');
  });
});

describe('Editor visual regression tests', () => {
  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress on classic light', async () => {
      await utils.setPage('/components/editor/example-index?theme=classic&mode=light&layout=nofrills');
      await browser.driver.sleep(config.sleep);
      const elem = await element(by.css('.editor-container'));

      expect(await browser.imageComparison.checkElement(elem, 'editor-subtle-light')).toEqual(0);
    });

    it('should not visually regress on classic dark', async () => {
      await utils.setPage('/components/editor/example-index?theme=classic&mode=dark&layout=nofrills');
      await browser.driver.sleep(config.sleep);
      const elem = await element(by.css('.editor-container'));

      expect(await browser.imageComparison.checkElement(elem, 'editor-subtle-dark')).toEqual(0);
    });

    it('should not visually regress on classic contrast', async () => {
      await utils.setPage('/components/editor/example-index?theme=classic&mode=contrast&layout=nofrills');
      await browser.driver.sleep(config.sleep);
      const elem = await element(by.css('.editor-container'));

      expect(await browser.imageComparison.checkElement(elem, 'editor-subtle-contrast')).toEqual(0);
    });

    it('should not visually regress on new dark', async () => {
      await utils.setPage('/components/editor/example-index?theme=new&mode=dark&layout=nofrills');
      await browser.driver.sleep(config.sleep);
      const elem = await element(by.css('.editor-container'));

      expect(await browser.imageComparison.checkElement(elem, 'editor-vibrant-dark')).toEqual(0);
    });

    it('should not visually regress on new contrast', async () => {
      await utils.setPage('/components/editor/example-index?theme=new&mode=contrast&layout=nofrills');
      await browser.driver.sleep(config.sleep);
      const elem = await element(by.css('.editor-container'));

      expect(await browser.imageComparison.checkElement(elem, 'editor-vibrant-contrast')).toEqual(0);
    });

    it('should not visually regress on classic rows setting', async () => {
      await utils.setPage('/components/editor/test-rows?theme=classic&mode=contrast&layout=nofrills');
      await browser.driver.sleep(config.sleep);
      const elem = await element(by.css('.editor-container'));

      expect(await browser.imageComparison.checkElement(elem, 'editor-subtle-rows')).toEqual(0);
    });

    it('should not visually regress on new rows setting', async () => {
      await utils.setPage('/components/editor/test-rows?theme=new&mode=contrast&layout=nofrills');
      await browser.driver.sleep(config.sleep);
      const elem = await element(by.css('.editor-container'));

      expect(await browser.imageComparison.checkElement(elem, 'editor-vibrant-rows')).toEqual(0);
    });
  }
});

describe('Editor preview mode tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/editor/example-preview?layout=nofrills');
  });

  it('should not have errors', async () => {  //eslint-disable-line
    await utils.checkForErrors();
  });

  it('should render editor in preview mode', async () => {
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

describe('Editor dirty tracking tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/editor/example-dirty-tracking?layout=nofrills');
  });

  it('should not have errors', async () => {  //eslint-disable-line
    await utils.checkForErrors();
  });

  it('should render dirty tracker', async () => {
    await element(by.css('button[data-action="bold"]')).click();
    await element(by.id('editor1')).sendKeys('Test');

    await browser.driver.wait(protractor.ExpectedConditions
      .visibilityOf(await element(by.css('.editor-container .icon-dirty'))), config.waitsFor);

    expect(await element(by.css('.editor-container .icon-dirty')).isDisplayed()).toBe(true);
  });

  it('should reset dirty tracker', async () => {
    await element(by.id('editor1')).sendKeys('T');

    await browser.driver.wait(protractor.ExpectedConditions
      .visibilityOf(await element(by.css('.editor-container .icon-dirty'))), config.waitsFor);

    expect(await element(by.css('.editor-container .icon-dirty')).isDisplayed()).toBe(true);

    const backKey = utils.isMac() || utils.isBS() || utils.isCI() ? 'BACK_SPACE' : 'DELETE';
    await element(by.id('editor1')).sendKeys(protractor.Key[backKey]);

    await browser.driver.wait(protractor.ExpectedConditions
      .stalenessOf(await element(by.css('.editor-container .icon-dirty'))), config.waitsFor);

    expect(await element(by.css('.editor-container .icon-dirty')).isPresent()).toBe(false);
  });

  it('should render dirty tracker in the source view', async () => {
    await element(by.css('button[data-action=source]')).click();
    await element(by.tagName('textarea')).sendKeys('<b>Test</b>');

    await browser.driver.wait(protractor.ExpectedConditions
      .visibilityOf(await element(by.css('.editor-container .icon-dirty'))), config.waitsFor);

    expect(await element(by.css('.editor-container .icon-dirty')).isDisplayed()).toBe(true);
  });
});

describe('Editor reset dirty tracking tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/editor/test-dirty-tracking-reset.html?layout=nofrills');
  });

  it('should not have errors', async () => {  //eslint-disable-line
    await utils.checkForErrors();
  });

  it('should reset dirty tracker on reset api', async () => {
    await element(by.id('editor1')).sendKeys('Test');
    await browser.driver.wait(protractor.ExpectedConditions
      .visibilityOf(await element(by.css('.editor-container .icon-dirty'))), config.waitsFor);

    expect(await element(by.css('.editor-container .icon-dirty')).isDisplayed()).toBe(true);
    await element(by.id('reset-dirty')).click();
    await browser.driver.wait(protractor.ExpectedConditions
      .stalenessOf(await element(by.css('.editor-container .icon-dirty'))), config.waitsFor);

    expect(await element(by.css('.editor-container .icon-dirty')).isPresent()).toBe(false);
  });

  it('should reset dirty tracker on edit', async () => {
    await element(by.id('editor1')).sendKeys('T');

    await browser.driver.wait(protractor.ExpectedConditions
      .visibilityOf(await element(by.css('.editor-container .icon-dirty'))), config.waitsFor);

    expect(await element(by.css('.editor-container .icon-dirty')).isDisplayed()).toBe(true);

    const backKey = utils.isMac() || utils.isBS() || utils.isCI() ? 'BACK_SPACE' : 'DELETE';
    await element(by.id('editor1')).sendKeys(protractor.Key[backKey]);

    await browser.driver.wait(protractor.ExpectedConditions
      .stalenessOf(await element(by.css('.editor-container .icon-dirty'))), config.waitsFor);

    expect(await element(by.css('.editor-container .icon-dirty')).isPresent()).toBe(false);
  });

  it('should reset dirty tracker after switch', async () => {
    await element(by.id('editor1')).clear();
    await element(by.id('editor1')).sendKeys('Test');
    await browser.driver.wait(protractor.ExpectedConditions
      .visibilityOf(await element(by.css('.editor-container .icon-dirty'))), config.waitsFor);

    expect(await element(by.css('.editor-container .icon-dirty')).isDisplayed()).toBe(true);
    await element(by.id('reset-dirty')).click();
    await browser.driver.wait(protractor.ExpectedConditions
      .stalenessOf(await element(by.css('.editor-container .icon-dirty'))), config.waitsFor);

    expect(await element(by.css('.editor-container .icon-dirty')).isPresent()).toBe(false);

    await element(by.css('button[data-action=source]')).click();
    await element(by.tagName('textarea')).clear();
    await element(by.tagName('textarea')).sendKeys('<p>2</p>');

    await browser.driver.wait(protractor.ExpectedConditions
      .visibilityOf(await element(by.css('.editor-container .icon-dirty'))), config.waitsFor);

    expect(await element(by.css('.editor-container .icon-dirty')).isDisplayed()).toBe(true);
    await element(by.id('reset-dirty')).click();
    await browser.driver.wait(protractor.ExpectedConditions
      .stalenessOf(await element(by.css('.editor-container .icon-dirty'))), config.waitsFor);

    expect(await element(by.css('.editor-container .icon-dirty')).isPresent()).toBe(false);
    await element(by.css('button[data-action=visual]')).click();
    await element(by.id('editor1')).clear();
    await element(by.id('editor1')).sendKeys('3');
    await browser.driver.wait(protractor.ExpectedConditions
      .visibilityOf(await element(by.css('.editor-container .icon-dirty'))), config.waitsFor);

    expect(await element(by.css('.editor-container .icon-dirty')).isDisplayed()).toBe(true);
    await element(by.id('reset-dirty')).click();
    await browser.driver.wait(protractor.ExpectedConditions
      .stalenessOf(await element(by.css('.editor-container .icon-dirty'))), config.waitsFor);

    expect(await element(by.css('.editor-container .icon-dirty')).isPresent()).toBe(false);
  });
});

describe('Editor empty tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/editor/test-empty?layout=nofrills');
  });

  it('should not have errors', async () => {  //eslint-disable-line
    await utils.checkForErrors();
  });

  it('should create p tags when entered from empty', async () => {
    const elem = await element(by.css('.editor'));

    await elem.sendKeys('This is a test');
    await browser.driver.sleep(config.sleep);

    expect(await element(by.css('.editor')).getAttribute('innerHTML')).toEqual('<p>This is a test</p>');
  });
});

describe('Editor placeholder tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/editor/test-placeholder?theme=classic&layout=nofrills');
  });

  it('should not have errors', async () => { //eslint-disable-line
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress', async () => { //eslint-disable-line
      const elem = await element(by.css('.editor'));

      expect(await browser.imageComparison.checkElement(elem, 'editor-placeholder')).toEqual(0);
    });
  }
});

describe('Editor modal tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/editor/test-modal?layout=nofrills');
  });

  it('should not change size on toggling source', async () => {
    await element(by.id('show-modal')).click();
    await browser.driver.sleep(config.sleep);
    const previewSize = await element(by.css('.editor')).getSize();

    await element(by.css('button[data-action=source]')).click();
    await browser.driver.sleep(config.sleep);
    const sourceSize = await element(by.css('.editor-source')).getSize();

    expect([previewSize.width, previewSize.width - 7]).toContain(sourceSize.width);
  });
});
