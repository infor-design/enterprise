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
});
