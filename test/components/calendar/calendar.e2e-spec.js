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

  it('Should be able to change month to next', async () => {
    const nextButton = await element(by.css('button.next'));
    const testDate = new Date();

    expect(await element(by.id('monthview-datepicker-field')).getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

    await nextButton.click();
    await utils.checkForErrors();
    await testDate.setDate(1);
    await testDate.setMonth(testDate.getMonth() + 1);

    expect(await element(by.id('monthview-datepicker-field')).getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

    expect(await element(by.id('monthview-datepicker-field')).getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    expect(await nextButton.getText()).toEqual('Next Month');
  });

  it('Should be able to change month to prev', async () => {
    const prevButton = await element(by.css('.btn-icon.prev'));
    const testDate = new Date();

    expect(await element(by.id('monthview-datepicker-field')).getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    await prevButton.click();
    await utils.checkForErrors();

    await testDate.setMonth(testDate.getMonth() - 1);
    await testDate.setHours(0);
    await testDate.setMinutes(0);
    await testDate.setSeconds(0);

    expect(await element(by.id('monthview-datepicker-field')).getAttribute('value')).toEqual(testDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

    expect(await prevButton.getText()).toEqual('Previous Month');
  });
});
