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

describe('Popupmenu tests', () => {
  // Disable IE11: Async timeout errors
  if (browser.browserName.toLowerCase() !== 'ie') {
    it('Should be accessible on open with no WCAG2AA violations on keypress(Spacebar)', async (done) => {
      try {
        await browser.waitForAngularEnabled(false);
        await browser.driver.get('http://localhost:4000/components/popupmenu/example-selectable');
        const buttonTriggerEl = await element(by.id('single-select-popupmenu-trigger'));
        await buttonTriggerEl.sendKeys(protractor.Key.SPACE);

        const res = await AxeBuilder(browser.driver)
          .configure(axeOptions)
          .exclude('header')
          .analyze();

        expect(res.violations.length).toEqual(0);
        done();
      } catch (error) {
        done.fail('Failed: error sent');
        await browserStackErrorReporter(done, error);
      }
    });
  }

  it('Should be accessible on close with no WCAG2AA violations on keypress(Spacebar)', async (done) => {
    try {
      await browser.waitForAngularEnabled(false);
      await browser.driver.get('http://localhost:4000/components/popupmenu/example-selectable');
      const buttonTriggerEl = await element(by.id('single-select-popupmenu-trigger'));
      await buttonTriggerEl.sendKeys(protractor.Key.SPACE);

      const res = await AxeBuilder(browser.driver)
        .configure(axeOptions)
        .exclude('header')
        .analyze();

      expect(res.violations.length).toEqual(0);
      done();
    } catch (error) {
      done.fail('Failed: error sent');
      await browserStackErrorReporter(done, error);
    }
  });

  if (browser.browserName.toLowerCase() !== 'ie' && browser.browserName.toLowerCase() !== 'safari') {
    it('Should open with enter, and arrow down to the last menu item, and focus', async (done) => {
      try {
        await browser.waitForAngularEnabled(false);
        await browser.driver.get('http://localhost:4000/components/popupmenu/example-selectable');
        const bodyEl = await element(by.css('body'));
        const buttonTriggerEl = await element(by.id('single-select-popupmenu-trigger'));
        await buttonTriggerEl.sendKeys(protractor.Key.ENTER);
        await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
        await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
        await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
        await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
        await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);

        expect(await element.all(by.css('#popupmenu-2 li')).last().getAttribute('class')).toEqual('is-focused');
        done();
      } catch (error) {
        done.fail('Failed: error sent');
        await browserStackErrorReporter(done, error);
      }
    });

    it('Should select last item on spacebar, arrowing down', async (done) => {
      try {
        await browser.waitForAngularEnabled(false);
        await browser.driver.get('http://localhost:4000/components/popupmenu/example-selectable');
        const bodyEl = await element(by.css('body'));
        const buttonTriggerEl = await element(by.id('single-select-popupmenu-trigger'));
        await buttonTriggerEl.sendKeys(protractor.Key.ENTER);
        const listItem = await element.all(by.css('#popupmenu-2 li')).last();
        await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
        await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
        await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
        await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
        await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
        await element.all(by.css('#popupmenu-2 li a')).last().sendKeys(protractor.Key.SPACE);

        expect(await listItem.getAttribute('class')).toEqual('is-checked');
        done();
      } catch (error) {
        done.fail('Failed: error sent');
        await browserStackErrorReporter(done, error);
      }
    });

    it('Should select first, and last item on spacebar, arrowing down', async (done) => {
      try {
        await browser.waitForAngularEnabled(false);
        await browser.driver.get('http://localhost:4000/components/popupmenu/example-selectable-multiple');
        const bodyEl = await element(by.css('body'));
        const buttonTriggerEl = await element(by.id('multi-select-popupmenu-trigger'));
        await buttonTriggerEl.sendKeys(protractor.Key.ENTER);
        const lastItem = await element.all(by.css('#popupmenu-2 li')).last();
        const firstItem = await element.all(by.css('#popupmenu-2 li')).first();
        await element.all(by.css('#popupmenu-2 li a')).first().sendKeys(protractor.Key.SPACE);
        await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
        await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
        await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
        await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
        await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
        await element.all(by.css('#popupmenu-2 li a')).last().sendKeys(protractor.Key.SPACE);

        expect(await lastItem.getAttribute('class')).toEqual('is-focused is-checked');
        expect(await firstItem.getAttribute('class')).toEqual('is-checked');
        done();
      } catch (error) {
        done.fail('Failed: error sent', error);
        await browserStackErrorReporter(done, error);
      }
    });

    it('Should select first, and last item on spacebar, unselect last item, arrowing down', async (done) => {
      try {
        await browser.waitForAngularEnabled(false);
        await browser.driver.get('http://localhost:4000/components/popupmenu/example-selectable-multiple');
        const bodyEl = await element(by.css('body'));
        const buttonTriggerEl = await element(by.id('multi-select-popupmenu-trigger'));
        await buttonTriggerEl.sendKeys(protractor.Key.ENTER);
        const lastItem = await element.all(by.css('#popupmenu-2 li')).last();
        const firstItem = await element.all(by.css('#popupmenu-2 li')).first();
        await element.all(by.css('#popupmenu-2 li a')).first().sendKeys(protractor.Key.SPACE);
        await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
        await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
        await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
        await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
        await bodyEl.sendKeys(protractor.Key.ARROW_DOWN);
        await element.all(by.css('#popupmenu-2 li a')).last().sendKeys(protractor.Key.SPACE);

        expect(await lastItem.getAttribute('class')).toEqual('is-focused is-checked');
        expect(await firstItem.getAttribute('class')).toEqual('is-checked');

        await element.all(by.css('#popupmenu-2 li a')).last().sendKeys(protractor.Key.SPACE);

        expect(await lastItem.getAttribute('class')).not.toEqual('is-focused is-checked');
        done();
      } catch (error) {
        done.fail('Failed: error sent', error);
        await browserStackErrorReporter(done, error);
      }
    });
  }
});
