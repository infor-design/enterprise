const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');

requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Form Tests', () => {
  if (utils.isChrome() && utils.isCI()) {
    it('Should not visual regress on compound fields', async () => {
      await utils.setPage('/components/form/test-compound-checkboxes-alignment?layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-compound-checkboxes-alignment')).toEqual(0);
    });

    it('Should not visual regress on forms layouts', async () => {
      await utils.setPage('/components/form/example-forms?layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-layouts')).toEqual(0);
    });

    it('Should not visual regress on input layouts', async () => {
      await utils.setPage('/components/form/example-inputs?layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-inputs')).toEqual(0);
    });

    it('Should not visual regress on checkboxes in columns', async () => {
      await utils.setPage('/components/form/test-checkbox-in-columns?layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-checkbox-in-columns')).toEqual(0);
    });

    it('Should not visual regress on compact/short fields', async () => {
      await utils.setPage('/components/form/example-compact-mode?layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-compact-mode')).toEqual(0);
    });

    it('Should not visual regress on compact/short fields in RTL', async () => {
      await utils.setPage('/components/form/example-compact-mode?layout=nofrills&locale=ar-SA');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleepLonger);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-compact-mode-rtl')).toEqual(0);
    });

    it('Should not visual regress on fields with very long labels', async () => { //eslint-disable-line
      await utils.setPage('/components/form/test-long-labels.html?layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-long-labels')).toEqual(0);
    });

    it('Should not visual regress on flex fields', async () => { //eslint-disable-line
      await utils.setPage('/components/form/test-flex-field.html?layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-flex-field')).toEqual(0);
    });

    it('Should not visual regress on bottom aligned rows', async () => { //eslint-disable-line
      await utils.setPage('/components/form/example-align-field-bottoms?layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-align-field-bottoms')).toEqual(0);
    });

    it('Should not visual regress on preventing wrapped labels', async () => { //eslint-disable-line
      await utils.setPage('/components/form/test-wrapped-labels?layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-wrapped-labels')).toEqual(0);
    });

    it('Should not visual regress on field height static text', async () => { //eslint-disable-line
      await utils.setPage('/components/form/test-field-size-data-labels?layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-field-size-data')).toEqual(0);
    });
  }
});
