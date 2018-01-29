describe('Dropdown tests', () => {
  it('Should open dropdown list on click', () => {
    const dropdownEl = element(by.css('div[aria-controls=dropdown-list]'));
    browser.waitForAngularEnabled(false);
    browser.get('http://localhost:4000/components/dropdown/example-index');
    browser.wait(protractor.ExpectedConditions.presenceOf(dropdownEl), 10000);
    dropdownEl.click();
    expect(element(by.className('is-open')).isDisplayed()).toBe(true);
  });
});
