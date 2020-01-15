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

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'form-compound-checkboxes-alignment')).toEqual(0);
    });

    it('Should not visual regress on forms layouts', async () => {
      await utils.setPage('/components/form/example-forms?layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'form-layouts')).toEqual(0);
    });

    it('Should not visual regress on input layouts', async () => {
      await utils.setPage('/components/form/example-inputs?layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'form-inputs')).toEqual(0);
    });

    it('Should not visual regress on checkboxes in columns', async () => {
      await utils.setPage('/components/form/test-checkbox-in-columns?layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'form-checkbox-in-columns')).toEqual(0);
    });

    it('Should not visual regress on compact/short fields', async () => {
      await utils.setPage('/components/form/example-compact-mode?layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'form-compact-fields')).toEqual(0);
    });

    it('Should not visual regress on compact/short fields in RTL', async () => {
      await utils.setPage('/components/form/example-compact-mode?layout=nofrills&locale=ar-SA');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.protractorImageComparison.checkElement(containerEl, 'form-compact-fields')).toEqual(0);
    });
  }
});
