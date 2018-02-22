const r2 = require('r2');

const username = process.env.BROWSER_STACK_USERNAME;
const accessKey = process.env.BROWSER_STACK_ACCESS_KEY;

describe('Dropdown tests', () => {
  it('Should open dropdown list on click', async (done) => {
    try {
      await browser.waitForAngularEnabled(false);
      await browser.driver.get('http://localhost:4000/components/dropdown/example-index');
      const dropdownEl = await element(by.css('div[aria-controls="dropdown-list"]'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(dropdownEl), 5000);
      await dropdownEl.click();
      expect(await element(by.className('is-open')).isDisplayed()).toBe(true);
      done();
    } catch (error) {
      const session = await browser.driver.getSession();
      const sessionId = session.getId();
      const url = `https://${username}:${accessKey}@api.browserstack.com/automate/sessions/${sessionId}.json`;
      const obj = {
        status: 'error',
        reason: error.name
      };
      await r2.put(url, { json: obj }).json;
      done.fail(error);
    }
  });

  it('Should scroll dropdown list when open then focus on arrow down', async (done) => {
    try {
      await browser.waitForAngularEnabled(false);
      await browser.driver.get('http://localhost:4000/components/dropdown/example-index');
      const dropdownEl = await element(by.css('div[aria-controls="dropdown-list"]'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(dropdownEl), 5000);
      await dropdownEl.click();
      const newYorkOption = await element(by.css('li[data-val="NY"]'));
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      expect(newYorkOption.getAttribute('class')).toEqual('dropdown-option is-focused');
      done();
    } catch (error) {
      const session = await browser.driver.getSession();
      const sessionId = session.getId();
      const url = `https://${username}:${accessKey}@api.browserstack.com/automate/sessions/${sessionId}.json`;
      const obj = {
        status: 'error',
        reason: error.name
      };
      await r2.put(url, { json: obj }).json;
      done.fail(error);
    }
  });
});
