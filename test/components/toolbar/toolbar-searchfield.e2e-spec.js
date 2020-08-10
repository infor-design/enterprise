const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

// Searchfield IDs
const sfId = 'regular-toolbar-searchfield';
const searchfieldInput = 'toolbar-searchfield-01';

describe('Toolbar Searchfield (no-reinvoke)', () => {
  beforeEach(async () => {
    await utils.setPage('/components/toolbar/test-searchfield-no-reinvoke-update?layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id(sfId))), config.waitsFor);
  });

  it('can be updated without issues', async () => {
    await element(by.id('update-toolbar')).click();
    await browser.driver.sleep(config.sleep);

    await utils.checkForErrors();
  });
});

describe('Searchfield with Toolbar alignment tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/toolbarsearchfield/example-flex-toolbar-align-with-searchfield?layout=nofrills');
    await browser.driver
      .wait(protractor.ExpectedConditions
        .presenceOf(element(by.id(searchfieldInput))), config.waitsFor);
  });

  it('Should not have errors', async () => {
    await utils.checkForErrors();
  });

  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on example-flex-toolbar-align-with-searchfield', async () => {
      const searchfieldInputEl = await element(by.id(searchfieldInput));
      const searchfieldToolbarContainer = await element(by.id('maincontent'));
      await browser.driver
        .wait(protractor.ExpectedConditions.presenceOf(searchfieldInputEl), config.waitsFor);
      await browser.driver.slee(config.sleep);
      expect(await browser.imageComparison.checkElement(searchfieldInputEl, 'toolbar-searchfield-init')).toEqual(0);

      await searchfieldInputEl.click();
      expect(await browser.imageComparison.checkElement(searchfieldToolbarContainer, 'toolbar-searchfield-alignment')).toEqual(0);
    });
  }
});
