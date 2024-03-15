describe('Datepicker clear test', () => {
  const url = 'http://localhost:4000/components/datepicker/test-input-datefield-clear.html';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

  it('should clear the date field', async () => {
    await page.click('[data-automation-id="custom-automation-id-trigger"]');

    await page.click('tbody > tr:nth-child(2) > td:nth-child(1) > .day-container > .day-text');
    await page.click('tbody > tr:nth-child(2) > td:nth-child(5) > .day-container > .day-text');
    await page.click('#primary-action-two');

    const inputField = await page.$eval('#date-field-normal', el => el.value);

    expect(inputField).toBe('');
    expect(inputField).not.toContain('Nan');
  });
});
