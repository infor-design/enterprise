const r2 = require('r2');

describe('Dropdown tests', () => {
  it('Should open dropdown list on click', async (done) => {
    const username = process.env.BROWSER_STACK_USERNAME;
    const accessKey = process.env.BROWSER_STACK_ACCESS_KEY;
    const session = await browser.driver.getSession();
    const sessionId = session.getId();
    try {
      await browser.waitForAngularEnabled(false);
      await browser.driver.get('http://localhost:4000/components/dropdown/example-index');
      const dropdownEl = await element(by.css('div[aria-controls="dropdown-list"]'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(dropdownEl), 5000);
      await dropdownEl.click();
      expect(await element(by.className('is-open')).isDisplayed()).toBe(true);
      done();
    } catch (error) {
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
