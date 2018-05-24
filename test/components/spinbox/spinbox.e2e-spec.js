// TODO: Write WCAG tests
// TODO: Write Visual Regression tests

const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

// Set page to test by url
const setPage = async function (url) {
  const pageurl = `${browser.baseUrl + url}?theme=${browser.params.theme}`;
  await browser.waitForAngularEnabled(false);
  await browser.driver.get(pageurl);
};

let spinboxEl;
const spinboxId = 'regular-spinbox';

describe('Spinbox example-index tests', () => {
  beforeEach(async () => {
    await setPage('/components/spinbox/example-index');
    spinboxEl = await element(by.id(spinboxId));
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.id(spinboxId))), config.waitsFor);
  });

  it('Should be set with down arrow', async () => {
    await spinboxEl.sendKeys(protractor.Key.ARROW_DOWN);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(spinboxEl), config.waitsFor);

    expect(await spinboxEl.getAttribute('value')).toEqual('0');
  });

  it('Should be set with up arrow', async () => {
    await spinboxEl.sendKeys(protractor.Key.ARROW_UP);
    await browser.driver
      .wait(protractor.ExpectedConditions.presenceOf(element(by.css('.spinbox-wrapper.is-focused'))), config.waitsFor);

    expect(await spinboxEl.getAttribute('value')).toEqual('1');
  });
});
