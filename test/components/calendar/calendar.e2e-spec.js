const { browserStackErrorReporter } = requireHelper('browserstack-error-reporter');
const utils = requireHelper('e2e-utils');
requireHelper('rejection');

jasmine.getEnv().addReporter(browserStackErrorReporter);

describe('Calendar index tests', () => {
  beforeEach(async () => {
    await utils.setPage('/components/calendar/example-index');
  });

  it('Should render without error', async () => {
    expect(await element.all(by.css('.monthview-table td')).count()).toEqual(42);
    await utils.checkForErrors();
  });

  it('Should be able to change months', async () => {
    const nextButton = await element(by.css('button.next'));
    const prevButton = await element(by.css('button.prev'));
    const monthYear = await element(by.id('monthview-datepicker-field'));
    const testDate = new Date();

    expect(monthYear.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

    await nextButton.click();
    await testDate.setDate(1);
    testDate.setMonth(testDate.getMonth() + 1);

    expect(monthYear.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

    await prevButton.click();
    await testDate.setDate(1);
    testDate.setMonth(testDate.getMonth() - 1);

    expect(monthYear.getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    expect(await prevButton.getText()).toEqual('Previous Month');
    expect(await nextButton.getText()).toEqual('Next Month');
  });
});
