const { parseHTML } = require("jquery");

describe('Dropdown Puppeteer Tests', () => {
  describe('Disabling Function Keys Tests', () => {
    const url = 'http://localhost:4000/components/dropdown/test-disabling-function-keys';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should disable function keys F1 to F12', async () => {
      const dropdownEl = await page.$('.dropdown');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      await page.keyboard.press('F1');
      await page.waitForTimeout(100); // this is needed because dropdown has some sort of delay to show
      expect(await page.evaluate(el => el.value, dropdownEl)).toEqual('');

      await page.keyboard.press('F2');
      await page.waitForTimeout(100); // this is needed because dropdown has some sort of delay to show
      expect(await page.evaluate(el => el.value, dropdownEl)).toEqual('');

      await page.keyboard.press('F3');
      await page.waitForTimeout(100); // this is needed because dropdown has some sort of delay to show
      expect(await page.evaluate(el => el.value, dropdownEl)).toEqual('');

      await page.keyboard.press('F4');
      await page.waitForTimeout(100); // this is needed because dropdown has some sort of delay to show
      expect(await page.evaluate(el => el.value, dropdownEl)).toEqual('');

      await page.keyboard.press('F5');
      await page.waitForTimeout(100); // this is needed because dropdown has some sort of delay to show
      expect(await page.evaluate(el => el.value, dropdownEl)).toEqual('');

      await page.keyboard.press('F6');
      await page.waitForTimeout(100); // this is needed because dropdown has some sort of delay to show
      expect(await page.evaluate(el => el.value, dropdownEl)).toEqual('');

      await page.keyboard.press('F7');
      await page.waitForTimeout(100); // this is needed because dropdown has some sort of delay to show
      expect(await page.evaluate(el => el.value, dropdownEl)).toEqual('');

      await page.keyboard.press('F8');
      await page.waitForTimeout(100); // this is needed because dropdown has some sort of delay to show
      expect(await page.evaluate(el => el.value, dropdownEl)).toEqual('');

      await page.keyboard.press('F9');
      await page.waitForTimeout(100); // this is needed because dropdown has some sort of delay to show
      expect(await page.evaluate(el => el.value, dropdownEl)).toEqual('');

      await page.keyboard.press('F10');
      await page.waitForTimeout(100); // this is needed because dropdown has some sort of delay to show
      expect(await page.evaluate(el => el.value, dropdownEl)).toEqual('');

      await page.keyboard.press('F11');
      await page.waitForTimeout(100); // this is needed because dropdown has some sort of delay to show
      expect(await page.evaluate(el => el.value, dropdownEl)).toEqual('');

      await page.keyboard.press('F12');
      await page.waitForTimeout(100); // this is needed because dropdown has some sort of delay to show
      expect(await page.evaluate(el => el.value, dropdownEl)).toEqual('');
    });
  });

  describe('Announced Error Message Text Tests', () => {
    const url = 'http://localhost:4000/components/dropdown/example-validation.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('Should include the error message in aria-label of dropdown error', async () => {
      const dropdownEl = await page.evaluate('document.querySelector("div.dropdown").getAttribute("aria-label")');
      expect(dropdownEl).toEqual('Validated Dropdown, '); // This is the initial value of aria-label when error message is not visible.

      await page.click('div.dropdown');
      await page.waitForTimeout(200);
      await page.click('#list-option-0');
      await page.keyboard.press('Tab');

      const newVal = await page.evaluate('document.querySelector("div.dropdown.error").getAttribute("aria-label")');
      expect(newVal).toEqual('Validated Dropdown, Required'); // Required text should append to the aria-label
    });
  });

describe('Dropdown for Enter key opens dropdown list, when it should only be used to select items within an open list', () => {
    const url = 'http://localhost:4000/components/dropdown/test-allow-custom-keystroke.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should have the enter key stroke to be disabled  ', async () => {
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      const ariaEx = await page.$eval('div[class="dropdown"]', el => el.getAttribute('aria-expanded'));
      expect(ariaEx).toMatch('false');
    });

    it('should select value when hovered and press enter', async () => {
      await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
      await page.hover('.dropdown-wrapper')
      await page.click('.dropdown-wrapper');
      await page.hover('#list-option-3');
      await page.keyboard.press('Enter');
      const ariaLbl = await page.$eval('div[class="dropdown"]', el => el.getAttribute('aria-label'));
      console.log('test>>> ' + ariaLbl);
      expect(ariaLbl).toContain('Fire Level E4');
    });
  });
});
