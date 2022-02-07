describe('Calendar event color tests', () => {
  const url = 'http://localhost:4000/components/calendar/test-event-custom-colors.html';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await page.setViewport({ width: 1920, height: 1080 });
  });

  it('should see the custom colors in events and legends', async () => {
    await page.waitForSelector('input.lightsalmon', { visible: true });
    const style1 = await page.$eval('a[data-id="80"', element => element.getAttribute('style'));
    expect(style1).toBe('background-color: lightsalmon; border-left-color: orangered;');
  });
  
  it('should not display the event accordingly when legend is uncheked', async () => {
    await page.waitForSelector('input.checkbox.powderblue', { visible: true });
    await page.click('label.checkbox-label[for=dto]');
    const event1 = await page.evaluate(() => {
      const el = document.querySelector('a[data-id="78"');
      return el ? el.style : '';
    });
    const event2 = await page.evaluate(() => {
      const el = document.querySelector('a[data-id="79"');
      return el ? el.style : '';
    });
    expect(event1).toBe('');
    expect(event2).toBe('');
  });

  it('should display the event accordingly when legend is cheked', async () => {
    await page.click('label.checkbox-label[for=sick]');
    await page.click('label.checkbox-label[for=sick]');
    const event3 = await page.evaluate(() => {
      const el = document.querySelector('a[data-id="80"');
      return el ? el.style : '';
    });
    expect(event3).not.toBe('');
  });
});
