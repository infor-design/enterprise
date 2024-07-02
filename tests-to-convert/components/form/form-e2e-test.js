const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');

requireHelper('rejection');

describe('Form Tests', () => {
  if (utils.isChrome() && utils.isCI()) {
    it('should not visually regress on compound fields', async () => {
      await utils.setPage('/components/form/test-compound-checkboxes-alignment?theme=classic&layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-compound-checkboxes-alignment')).toEqual(0);
    });

    it('should not visually regress on forms layouts', async () => {
      await utils.setPage('/components/form/example-forms?theme=classic&layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-layouts')).toEqual(0);
    });

    xit('should not visually regress on input layouts', async () => {
      await utils.setPage('/components/form/example-inputs?theme=classic&layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-inputs')).toEqual(0);
    });

    it('should not visually regress on checkboxes in columns', async () => {
      await utils.setPage('/components/form/test-checkbox-in-columns?theme=classic&layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-checkbox-in-columns')).toEqual(0);
    });

    it('should not visually regress on compact/short fields', async () => {
      await utils.setPage('/components/form/example-compact-mode?theme=classic&layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-compact-mode')).toEqual(0);
    });

    it('should not visually regress on fields with very long labels', async () => { //eslint-disable-line
      await utils.setPage('/components/form/test-long-labels.html?theme=classic&layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-long-labels')).toEqual(0);
    });

    it('should not visually regress on flex fields', async () => { //eslint-disable-line
      await utils.setPage('/components/form/test-flex-field.html?theme=classic&layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-flex-field')).toEqual(0);
    });

    it('should not visually regress on bottom aligned rows', async () => { //eslint-disable-line
      await utils.setPage('/components/form/example-align-field-bottoms?theme=classic&layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-align-field-bottoms')).toEqual(0);
    });

    it('should not visually regress on preventing wrapped labels', async () => { //eslint-disable-line
      await utils.setPage('/components/form/test-wrapped-labels?theme=classic&layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-wrapped-labels')).toEqual(0);
    });

    it('should not visually regress on field height static text', async () => { //eslint-disable-line
      await utils.setPage('/components/form/test-field-size-data-labels?theme=classic&layout=nofrills');
      const containerEl = await element(by.className('container'));
      await browser.driver.sleep(config.sleep);

      await utils.checkForErrors();

      expect(await browser.imageComparison.checkElement(containerEl, 'form-field-size-data')).toEqual(0);
    });
  }
});
