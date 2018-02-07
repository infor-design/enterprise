const r2 = require('r2');
let sessionId;

describe('Dropdown tests', () => {
  it('Should open dropdown list on click', async (done) => {
    try {
      session = await browser.driver.getSession();
      await browser.waitForAngularEnabled(false);
      await browser.driver.get('http://localhost:4000/components/dropdown/example-index');
      const dropdownEl = await element(by.css('div[aria-controls=dropdown-list]'));
      await browser.driver.wait(protractor.ExpectedConditions.presenceOf(dropdownEl), 5000);
      await dropdownEl.click();
      expect(await element(by.className('is-open')).isDisplayed()).toBe(true);
      done();
    } catch(error) {
      sessionId = session.getId();
      console.log(sessionId);
      const username = process.env.BROWSER_STACK_USERNAME;
      const accessKey = process.env.BROWSER_STACK_ACCESS_KEY;
      const url = `https://${username}:${accessKey}@api.browserstack.com/automate/sessions/${sessionId}.json`
      const obj = {
        status: 'error',
        reason: error.name
      }
      let res = await r2.put(url, {json: obj}).json;
      console.log(res);
      done.fail(error);
    }
  });
});
