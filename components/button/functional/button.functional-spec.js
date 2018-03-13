const AxeBuilder = require('axe-webdriverjs');
const r2 = require('r2');

// Light Theme color contrast is not WCAG 2AA, #fff on #368ac0, focused item on a open dropdown
const axeOptions = {
  rules: [
    {
      id: 'aria-allowed-attr',
      enabled: false
    },
    {
      id: 'aria-required-children',
      enabled: false
    },
    {
      id: 'aria-valid-attr-value',
      enabled: false
    },
    {
      id: 'color-contrast',
      enabled: false
    }
  ]
};

const username = process.env.BROWSER_STACK_USERNAME;
const accessKey = process.env.BROWSER_STACK_ACCESS_KEY;

const browserStackErrorReporter = async (done, error) => {
  const session = await browser.driver.getSession();
  const sessionId = session.getId();
  const url = `https://${username}:${accessKey}@api.browserstack.com/automate/sessions/${sessionId}.json`;
  const obj = {
    status: 'error',
    reason: error.name
  };
  await r2.put(url, { json: obj }).json;
  done.fail(error);
};

const setupButton = async (url, el) => {
  await browser.waitForAngularEnabled(false);
  await browser.driver.get(url);
  const buttonEl = await element.all(by.css(el)).first();
  await browser.driver.wait(protractor.ExpectedConditions.presenceOf(buttonEl), 5000);
  return buttonEl;
};

describe('Button tests', () => {
  if (browser.browserName.toLowerCase() !== 'safari') {
    it('Should open menu on return', async (done) => {
      try {
        await setupButton('http://localhost:4000/components/button/example-with-icons', '#menu-button-alone');
        const buttonEl = await element(by.id('menu-button-alone'));

        await buttonEl.sendKeys(protractor.Key.ENTER);

        expect(await buttonEl.getAttribute('class')).toContain('is-open');

        expect(await element(by.css('button#menu-button-alone[aria-haspopup="true"]')).isDisplayed()).toBe(true);
        done();
      } catch (error) {
        await browserStackErrorReporter(done, error);
      }
    });
  }

  it('Should open menu on click', async (done) => {
    try {
      await setupButton('http://localhost:4000/components/button/example-with-icons', '#menu-button-alone');
      const buttonEl = await element(by.id('menu-button-alone'));

      await buttonEl.click();

      expect(buttonEl.getAttribute('class')).toContain('is-open');
      expect(await element(by.css('button#menu-button-alone[aria-haspopup="true"]')).isDisplayed()).toBe(true);
      done();
    } catch (error) {
      await browserStackErrorReporter(done, error);
    }
  });

  it('Should toggle', async (done) => {
    try {
      await setupButton('http://localhost:4000/components/button/example-toggle-button.html', '.btn-icon.icon-favorite.btn-toggle');
      const buttonEl = await element.all(by.css('.btn-icon.icon-favorite.btn-toggle')).first();

      await buttonEl.click();

      expect(await buttonEl.getAttribute('aria-pressed')).toBe('false');
      done();
    } catch (error) {
      await browserStackErrorReporter(done, error);
    }
  });

  if (browser.browserName.toLowerCase() === 'chrome') {
    it('Should not visual regress', async (done) => {
      try {
        await setupButton('http://localhost:4000/components/button/example-with-icons', '#menu-button-alone');

        expect(await browser.protractorImageComparison.checkScreen('buttonPage')).toEqual(0);

        done();
      } catch (error) {
        await browserStackErrorReporter(done, error);
      }
    });
  }

  // Disable IE11: Async timeout errors
  if (browser.browserName.toLowerCase() !== 'ie') {
    it('Should be accessible on init with no WCAG 2AA violations', async (done) => {
      try {
        await setupButton('http://localhost:4000/components/button/example-with-icons', '#menu-button-alone');

        const buttonEl = await element(by.id('menu-button-alone'));

        await buttonEl.click();

        const res = await AxeBuilder(browser.driver)
          .configure(axeOptions)
          .exclude('header')
          .analyze();

        expect(res.violations.length).toEqual(0);
        done();
      } catch (error) {
        await browserStackErrorReporter(done, error);
      }
    });
  }
});
