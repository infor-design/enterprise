describe('Dropdown Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/dropdown';

  describe('Disabling Function Keys Tests', () => {
    const url = `${baseUrl}/test-disabling-function-keys`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should disable function keys F1 to F12', async () => {
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      await page.keyboard.press('F1');
      await page.evaluate(() => document.querySelector('select.dropdown').value)
        .then(el => expect(el).toEqual(''));

      await page.keyboard.press('F2');
      await page.evaluate(() => document.querySelector('select.dropdown').value)
        .then(el => expect(el).toEqual(''));

      await page.keyboard.press('F3');
      await page.evaluate(() => document.querySelector('select.dropdown').value)
        .then(el => expect(el).toEqual(''));

      await page.keyboard.press('F4');
      await page.evaluate(() => document.querySelector('select.dropdown').value)
        .then(el => expect(el).toEqual(''));

      await page.keyboard.press('F5');
      await page.evaluate(() => document.querySelector('select.dropdown').value)
        .then(el => expect(el).toEqual(''));

      await page.keyboard.press('F6');
      await page.evaluate(() => document.querySelector('select.dropdown').value)
        .then(el => expect(el).toEqual(''));

      await page.keyboard.press('F7');
      await page.evaluate(() => document.querySelector('select.dropdown').value)
        .then(el => expect(el).toEqual(''));

      await page.keyboard.press('F8');
      await page.evaluate(() => document.querySelector('select.dropdown').value)
        .then(el => expect(el).toEqual(''));

      await page.keyboard.press('F9');
      await page.evaluate(() => document.querySelector('select.dropdown').value)
        .then(el => expect(el).toEqual(''));

      await page.keyboard.press('F10');
      await page.evaluate(() => document.querySelector('select.dropdown').value)
        .then(el => expect(el).toEqual(''));

      await page.keyboard.press('F11');
      await page.evaluate(() => document.querySelector('select.dropdown').value)
        .then(el => expect(el).toEqual(''));

      await page.keyboard.press('F12');
      await page.evaluate(() => document.querySelector('select.dropdown').value)
        .then(el => expect(el).toEqual(''));
    });
  });

  describe('Announced Error Message Text Tests', () => {
    const url = `${baseUrl}/example-validation.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should include the error message in aria-label of dropdown error', async () => {
      await page.evaluate(() => document.querySelector('div.dropdown').getAttribute('aria-label'))
        .then(el => expect(el).toEqual('Validated Dropdown, '));

      await page.click('div.dropdown');
      await page.waitForTimeout(200);
      await page.click('#list-option-0');
      await page.keyboard.press('Tab');

      await page.evaluate(() => document.querySelector('div.dropdown.error').getAttribute('aria-label'))
        .then(el => expect(el).toEqual('Validated Dropdown, Required'));
    });
  });

  describe('Supports custom keystrokes', () => {
    const url = `${baseUrl}/test-allow-custom-keystroke.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should support disabling the enter key when closed with the onKeyDown function', async () => {
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');

      await page.evaluate(() => document.querySelector('div.dropdown').getAttribute('aria-expanded'))
        .then(ariaExpanded => expect(ariaExpanded).toContain('false'));
    });

    it('should support using the enter key to select while using the onKeyDown function', async () => {
      await page.hover('.dropdown-wrapper');
      await page.click('.dropdown-wrapper');
      await page.hover('#list-option-3');
      await page.keyboard.press('Enter');
      await page.keyboard.press('Tab');

      await page.evaluate(() => document.querySelector('div.dropdown').getAttribute('aria-label'))
        .then(ariaLabel => expect(ariaLabel).toContain('Dropdown allows custom keystroke, Fire Level E4'));
    });
  });
});
