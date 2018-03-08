const r2 = require('r2');

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

const clickOnDropdown = async () => {
  await browser.waitForAngularEnabled(false);
  await browser.driver.get('http://localhost:4000/components/dropdown/example-index');
  const dropdownEl = await element(by.css('div[aria-controls="dropdown-list"]'));
  await browser.driver.wait(protractor.ExpectedConditions.presenceOf(dropdownEl), 5000);
  await dropdownEl.click();
};

describe('Dropdown tests', () => {
  it('Should open dropdown list on click', async (done) => {
    try {
      await clickOnDropdown();

      expect(await element(by.className('is-open')).isDisplayed()).toBe(true);
      done();
    } catch (error) {
      await browserStackErrorReporter(done, error);
    }
  });

  it('Should arrow down to New York, and focus', async (done) => {
    try {
      await clickOnDropdown();

      const dropdownEl = await element(by.css('div[aria-controls="dropdown-list"]'));
      const newYorkOption = await element(by.css('li[data-val="NY"]'));
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);
      await dropdownEl.sendKeys(protractor.Key.ARROW_DOWN);

      expect(newYorkOption.getAttribute('class')).toEqual('dropdown-option is-focused');
      done();
    } catch (error) {
      await browserStackErrorReporter(done, error);
    }
  });

  it('Should scroll down to end of list, and Vermont should be visible', async (done) => {
    try {
      await clickOnDropdown();

      await browser.executeScript('document.querySelector("ul[role=\'listbox\']").scrollTop = 10000');
      const dropdownElList = await element(by.css('ul[role="listbox"]'));
      const vermontOption = await element(by.css('li[data-val="VT"]'));
      const posVT = await vermontOption.getLocation();
      const dropdownElListSize = await dropdownElList.getSize();
      const posDropdownElList = await dropdownElList.getLocation();

      expect(posVT.y > posDropdownElList.y &&
        posVT.y < (posDropdownElList.y + dropdownElListSize.height)).toBeTruthy();
      done();
    } catch (error) {
      await browserStackErrorReporter(done, error);
    }
  });
});
