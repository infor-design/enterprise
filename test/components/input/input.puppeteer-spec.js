describe('Input mobile and style changes tests', () => {
  const url = 'http://localhost:4000/components/input/example-form-layouts.html';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await page.setViewport({ width: 1920, height: 1080 });
  });

  it('should have 44px height for large input', async () => {
    const largeFNAmeHeight = await page.$eval('input[id="first-name"]', el => getComputedStyle(el).getPropertyValue('height'));
    const largeLNAmeHeight = await page.$eval('input[id="last-name"]', el => getComputedStyle(el).getPropertyValue('height'));
    const largeEmailHeight = await page.$eval('input[id="email-address"]', el => getComputedStyle(el).getPropertyValue('height'));
    const largeEmailOKHeight = await page.$eval('input[id="email-address-ok"]', el => getComputedStyle(el).getPropertyValue('height'));
    const largeDisabledHeight = await page.$eval('input[id="department"]', el => getComputedStyle(el).getPropertyValue('height'));
    const largeDepCodeHeight = await page.$eval('input[id="department-code"]', el => getComputedStyle(el).getPropertyValue('height'));
    const largeDirtyHeight = await page.$eval('input[id="department-code-trackdirty"]', el => getComputedStyle(el).getPropertyValue('height'));
    const largeAlphaHeight = await page.$eval('input[id="alpha-field"]', el => getComputedStyle(el).getPropertyValue('height'));
    const largeDecHeight = await page.$eval('input[id="decimal-field"]', el => getComputedStyle(el).getPropertyValue('height'));
    const largePhoneHeight = await page.$eval('input[id="phone-number"]', el => getComputedStyle(el).getPropertyValue('height'));
    const largeDateHeight = await page.$eval('input[id="date-input"]', el => getComputedStyle(el).getPropertyValue('height'));
    const largeDTimeHeight = await page.$eval('input[id="datetime-input"]', el => getComputedStyle(el).getPropertyValue('height'));
    const largeTimeHeight = await page.$eval('input[id="time-input"]', el => getComputedStyle(el).getPropertyValue('height'));
    const largeCCardHeight = await page.$eval('input[id="credit-card"]', el => getComputedStyle(el).getPropertyValue('height'));
    expect(largeFNAmeHeight && largeLNAmeHeight && largeEmailHeight && largeEmailOKHeight && largeDisabledHeight && largeDepCodeHeight && largeDirtyHeight && largeAlphaHeight && largeDecHeight && largePhoneHeight && largeDateHeight && largeDTimeHeight && largeTimeHeight && largeCCardHeight).toMatch('44px');
  });

  it('should have 16px left and right padding', async () => {
    const leftFNAmeHeight = await page.$eval('input[id="first-name"]', el => getComputedStyle(el).getPropertyValue('padding-left'));
    const leftLNAmeHeight = await page.$eval('input[id="last-name"]', el => getComputedStyle(el).getPropertyValue('padding-left'));
    const leftEmailHeight = await page.$eval('input[id="email-address"]', el => getComputedStyle(el).getPropertyValue('padding-left'));
    const leftEmailOKHeight = await page.$eval('input[id="email-address-ok"]', el => getComputedStyle(el).getPropertyValue('padding-left'));
    const leftDisabledHeight = await page.$eval('input[id="department"]', el => getComputedStyle(el).getPropertyValue('padding-left'));
    const leftDepCodeHeight = await page.$eval('input[id="department-code"]', el => getComputedStyle(el).getPropertyValue('padding-left'));
    const leftDirtyHeight = await page.$eval('input[id="department-code-trackdirty"]', el => getComputedStyle(el).getPropertyValue('padding-left'));
    const leftAlphaHeight = await page.$eval('input[id="alpha-field"]', el => getComputedStyle(el).getPropertyValue('padding-left'));
    const leftDecHeight = await page.$eval('input[id="decimal-field"]', el => getComputedStyle(el).getPropertyValue('padding-left'));
    const leftPhoneHeight = await page.$eval('input[id="phone-number"]', el => getComputedStyle(el).getPropertyValue('padding-left'));
    const leftDateHeight = await page.$eval('input[id="date-input"]', el => getComputedStyle(el).getPropertyValue('padding-left'));
    const leftDTimeHeight = await page.$eval('input[id="datetime-input"]', el => getComputedStyle(el).getPropertyValue('padding-left'));
    const leftTimeHeight = await page.$eval('input[id="time-input"]', el => getComputedStyle(el).getPropertyValue('padding-left'));
    const leftCCardHeight = await page.$eval('input[id="credit-card"]', el => getComputedStyle(el).getPropertyValue('padding-left'));
    expect(leftFNAmeHeight && leftLNAmeHeight && leftEmailHeight && leftEmailOKHeight && leftDisabledHeight && leftDepCodeHeight && leftDirtyHeight && leftAlphaHeight && leftDecHeight && leftPhoneHeight && leftDateHeight && leftDTimeHeight && leftTimeHeight && leftCCardHeight).toMatch('16px');

    const rightFNAmeHeight = await page.$eval('input[id="first-name"]', el => getComputedStyle(el).getPropertyValue('padding-right'));
    const rightLNAmeHeight = await page.$eval('input[id="last-name"]', el => getComputedStyle(el).getPropertyValue('padding-right'));
    const rightEmailHeight = await page.$eval('input[id="email-address"]', el => getComputedStyle(el).getPropertyValue('padding-right'));
    const rightEmailOKHeight = await page.$eval('input[id="email-address-ok"]', el => getComputedStyle(el).getPropertyValue('padding-right'));
    const rightDisabledHeight = await page.$eval('input[id="department"]', el => getComputedStyle(el).getPropertyValue('padding-right'));
    const rightDepCodeHeight = await page.$eval('input[id="department-code"]', el => getComputedStyle(el).getPropertyValue('padding-right'));
    const rightDirtyHeight = await page.$eval('input[id="department-code-trackdirty"]', el => getComputedStyle(el).getPropertyValue('padding-right'));
    const rightAlphaHeight = await page.$eval('input[id="alpha-field"]', el => getComputedStyle(el).getPropertyValue('padding-right'));
    const rightDecHeight = await page.$eval('input[id="decimal-field"]', el => getComputedStyle(el).getPropertyValue('padding-right'));
    const rightPhoneHeight = await page.$eval('input[id="phone-number"]', el => getComputedStyle(el).getPropertyValue('padding-right'));
    const rightDateHeight = await page.$eval('input[id="date-input"]', el => getComputedStyle(el).getPropertyValue('padding-right'));
    const rightDTimeHeight = await page.$eval('input[id="datetime-input"]', el => getComputedStyle(el).getPropertyValue('padding-right'));
    const rightTimeHeight = await page.$eval('input[id="time-input"]', el => getComputedStyle(el).getPropertyValue('padding-right'));
    const rightCCardHeight = await page.$eval('input[id="credit-card"]', el => getComputedStyle(el).getPropertyValue('padding-right'));
    expect(rightFNAmeHeight && rightLNAmeHeight && rightEmailHeight && rightEmailOKHeight && rightDisabledHeight && rightDepCodeHeight && rightDirtyHeight && rightAlphaHeight && rightDecHeight && rightPhoneHeight && rightDateHeight && rightDTimeHeight && rightTimeHeight && rightCCardHeight).toMatch('16px');
  });
});
