const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
const config = requireHelper('e2e-config');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Icon Soho (Subtle) tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/icons/example-index?layout=nofrills');
    await browser.driver.sleep(config.sleep);
  });

  it('Should render without any error', async () => {
    await utils.checkForErrors();
  });
});

describe('Icon New Theme tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/icons/example-index?theme=new&layout=nofrills');
    await browser.driver.sleep(config.sleep);
  });

  it('Should render without error', async () => {
    await utils.checkForErrors();
  });
});
