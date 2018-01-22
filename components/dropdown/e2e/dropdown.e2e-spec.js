describe('Render page', () => {
  it('Should open dropdown list on click', () => {
    browser.get('http://localhost:4000/components/dropdown/example-index');
    element(by.css('div[aria-controls=dropdown-list]')).click();
    expect(element(by.className('is-open')).isDisplayed()).toBe(true);
  });
});
