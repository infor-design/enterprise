const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = require('../../helpers/e2e-config.js');

requireHelper('rejection');

const axePageObjects = requireHelper('axe-page-objects');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Textarea example-index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/textarea/example-index');
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  it('Should block input on disabled', async () => {
    const textareaEl = await element(by.id('description-disabled'));

    expect(await textareaEl.isEnabled()).toBe(false);
  });

  it('Should block input on readonly', async () => {
    const textareaEl = await element(by.id('description-readonly'));

    expect(await textareaEl.getAttribute('readonly')).toBe('true');
  });

  it('Should maintain counts', async () => {
    await element(by.id('description-max')).sendKeys('This is a test');

    expect(await element(by.css('#description-max + span')).getText()).toBe('You can type 68 more characters.');
  });

  if (!utils.isIE()) {
    it('Should be accessible on click, and open with no WCAG 2AA violations', async () => {
      const res = await axePageObjects(browser.params.theme);

      expect(res.violations.length).toEqual(0);
    });
  }

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const textareaEl = await element(by.id('description-max'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(textareaEl), config.waitsFor);
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(textareaEl, 'textarea-init')).toEqual(0);
    });
  }

  it('Should allow maximum of 90 characters', async () => {
    const charStr = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt';
    await element(by.id('description-max')).clear();
    await element(by.id('description-max')).sendKeys(charStr);

    expect(await element(by.id('description-max')).getAttribute('value')).toEqual(charStr);
    expect(await element(by.css('#description-max + span')).getText()).toBe('You can type 1 more characters.');
  });

  it('Should show validation message if more than/equal to 90 characters', async () => {
    const charStr90 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ';
    await element(by.id('description-max')).clear();
    await element(by.id('description-max')).sendKeys(charStr90);

    expect(await element(by.id('description-max')).getAttribute('value')).toEqual(charStr90);

    expect(await element(by.className('textarea-wordcount'))).toBeTruthy();
  });

  it('Should allow copy/paste', async () => {
    const sampleStr = 'Lorem ipsum';

    await element(by.id('description-dirty')).clear();
    await element(by.id('description-dirty')).sendKeys(sampleStr);
    await element(by.id('description-dirty')).sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
    await element(by.id('description-dirty')).sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'c'));

    await element(by.id('description-dirty')).sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'v'));

    expect(await element(by.id('description-dirty')).getAttribute('value')).toEqual(sampleStr);
  });

  it('Should allow special characters', async () => {
    const specChars = '¤¶§Çüéâôûÿ£¥';
    await element(by.id('description-max')).clear();
    await element(by.id('description-max')).sendKeys(specChars);

    expect(await element(by.id('description-max')).getAttribute('value')).toEqual(specChars);
  });

  it('Should display textbox label correctly', async () => {
    await browser.driver
      .wait(protractor.ExpectedConditions.visibilityOf(await element.all(by.css('.field label')).get(0)), config.waitsFor);

    expect(await element.all(by.css('.field label')).get(0).isDisplayed()).toBeTruthy();
  });

  it('Should enable scrollbar when multiple lines of text is in field box', async () => {
    await element(by.id('description-max')).sendKeys(protractor.Key.ENTER);
    await element(by.id('description-max')).sendKeys(protractor.Key.ENTER);
    await element(by.id('description-max')).sendKeys(protractor.Key.ENTER);
    await element(by.id('description-max')).sendKeys(protractor.Key.ENTER);
    await element(by.id('description-max')).sendKeys(protractor.Key.ENTER);
    await element(by.id('description-max')).sendKeys(protractor.Key.ENTER);
    await element(by.id('description-max')).sendKeys(protractor.Key.ENTER);
    await element(by.id('description-max')).sendKeys(protractor.Key.ENTER);

    expect(await element(by.id('description-max')).getAttribute('scrollHeight')).toBeGreaterThan(await element(by.id('description-max')).getAttribute('height'));
  });

  it('Should display dirty tracker if text area is updated and unfocused', async () => {
    await element(by.id('description-dirty')).sendKeys('1');

    await element(by.id('description-max')).click();

    expect(await element(by.className('icon-dirty'))).toBeTruthy();
  });

  it('Should display required error message if text area is empty', async () => {
    await element(by.id('description-error')).clear();

    expect(await element(by.className('icon-error'))).toBeTruthy();
  });
});

describe('Textarea size tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/textarea/example-sizes');
  });

  it('Should support check sizes', async () => {
    const windowSize = await browser.driver.manage().window().getSize();
    await browser.driver.manage().window().setSize(1200, 800);
    await browser.driver.sleep(config.sleepShort);

    const smEl = await element(by.id('sm-textarea-example'));

    expect(await smEl.getCssValue('width')).toBe('150px');

    const mdEl = await element(by.id('def-textarea-example'));

    expect(await mdEl.getCssValue('width')).toBe('362px');

    const lgEl = await element(by.id('lg-textarea-example'));

    expect(await lgEl.getCssValue('width')).toBe('400px');

    const responsiveEl = await element(by.id('responsive'));

    const h = parseInt(await responsiveEl.getCssValue('width'), 10);

    expect(h).toBeGreaterThan(950);
    await browser.driver.manage().window().setSize(windowSize.width, windowSize.height);
  });
});

describe('Textarea auto grow tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/textarea/example-autogrow');
  });

  it('Should support autogrow', async () => {
    const textareaEl = await element(by.id('autogrow'));
    await textareaEl.sendKeys('Test');
    await textareaEl.sendKeys(protractor.Key.ENTER);
    await textareaEl.sendKeys('Test');
    await textareaEl.sendKeys(protractor.Key.ENTER);
    await textareaEl.sendKeys('Test');
    await textareaEl.sendKeys(protractor.Key.ENTER);
    await textareaEl.sendKeys('Test');
    await textareaEl.sendKeys(protractor.Key.ENTER);
    await textareaEl.sendKeys('Test');
    await textareaEl.sendKeys(protractor.Key.ENTER);
    await textareaEl.sendKeys('Test');
    await textareaEl.sendKeys(protractor.Key.ENTER);
    await textareaEl.sendKeys('Test');
    await textareaEl.sendKeys(protractor.Key.ENTER);

    await browser.driver.sleep(config.sleep);
    const h = parseInt(await textareaEl.getCssValue('height'), 10);

    // Allowing for browser diffs but should grow around to 180
    expect(h).toBeGreaterThan(175);
    expect(h).toBeLessThan(185);
  });
});

describe('Textarea Modal Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/textarea/test-modal');
  });

  it('Should not close a modal when hitting enter', async () => {
    const modalButton = await element(by.id('button-1'));
    modalButton.click();
    await browser.driver.sleep(config.sleepLonger);

    const textareaEl = await element(by.id('context-desc'));
    await textareaEl.sendKeys('Test');
    await textareaEl.sendKeys(protractor.Key.ENTER);
    await textareaEl.sendKeys('Test');
    await textareaEl.sendKeys(protractor.Key.ENTER);

    const text = await textareaEl.getAttribute('value');

    expect(text.replace(/(\r\n\t|\n|\r\t)/gm, '')).toBe('TestTest');
    expect(await element(by.id('modal-1')).isDisplayed()).toBeTruthy();
  });
});

describe('Textarea Rows Tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/textarea/test-rows?layout=nofrills');
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress', async () => {
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      expect(await browser.imageComparison.checkElement(containerEl, 'textarea-rows')).toEqual(0);
    });
  }
});
