const { getConfig } = require('../../helpers/e2e-utils.js');

describe('Textarea', () => {
  const baseUrl = 'http://localhost:4000/components/textarea';

  // Clearing and/or selecting the input field
  const clearInput = async (page, { selector }, isClear = true) => {
    const input = await page.$(selector);
    await input.click({ clickCount: 3 });

    if (isClear) {
      await page.keyboard.press('Backspace');
    }
  };

  describe('Index', () => {
    const url = `${baseUrl}/example-index?theme=classic`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not visually regress', async () => {
      await page.waitForSelector('#description-max', { visible: true });

      const descriptionMaxInput = await page.$('#description-max');
      const image = await descriptionMaxInput.screenshot();
      const config = getConfig('textarea-init');
      expect(image).toMatchImageSnapshot(config);
    });

    it('should block input on disabled', async () => {
      await page.evaluate(() => document.getElementById('description-disabled').getAttribute('disabled'))
        .then(disabledAttr => expect(disabledAttr).toBe('true'));
    });

    it('should block input on readonly', async () => {
      await page.evaluate(() => document.getElementById('description-readonly').getAttribute('readonly'))
        .then(readonlyAttr => expect(readonlyAttr).toBe('true'));
    });

    it('should maintain counts', async () => {
      await page.waitForSelector('#description-max', { visible: true });
      await page.type('#description-max', 'This is a test');

      await page.evaluate(() => document.querySelector('.textarea-wordcount').textContent)
        .then(textVal => expect(textVal).toBe('Characters left 68'));
    });

    it('should be accessible with no WCAG 2AA violations', async () => {
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
    });

    it('should allow maximum of 90 characters', async () => {
      await clearInput(page, { selector: '#description-max' });

      await page.evaluate(() => {
        document.getElementById('description-max').value = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt';
      });

      // Needs to tab out to update the word count text.
      await page.keyboard.press('Tab');

      await page.evaluate(() => document.getElementById('description-max').value)
        .then(val => expect(val).toEqual('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'));

      await page.evaluate(() => document.querySelector('.textarea-wordcount').textContent)
        .then(textContent => expect(textContent).toEqual('Characters left 1'));
    });

    it('should show validation message if more than/equal to 90 characters', async () => {
      await clearInput(page, { selector: '#description-max' });

      await page.evaluate(() => {
        document.getElementById('description-max').value = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt';
      });

      await page.keyboard.press('Tab');
      await page.evaluate(() => document.getElementById('description-max').value)
        .then(val => expect(val).toEqual('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'));

      expect(await page.waitForSelector('.textarea-wordcount')).toBeTruthy();
    });

    it('should allow special characters', async () => {
      await clearInput(page, { selector: '#description-max' });

      await page.evaluate(() => {
        document.getElementById('description-max').value = '¤¶§Çüéâôûÿ£¥';
      });

      await page.evaluate(() => document.getElementById('description-max').value)
        .then(val => expect(val).toEqual('¤¶§Çüéâôûÿ£¥'));
    });

    it('should display textarea label correctly', async () => {
      expect(await page.waitForSelector('.field label', { visible: true })).toBeTruthy();
    });

    it('should enable scrollbar when multiple lines of text are in the field box', async () => {
      await page.click('#description-max');
      await page.keyboard.press('Enter');
      await page.keyboard.press('Enter');
      await page.keyboard.press('Enter');
      await page.keyboard.press('Enter');

      const scrollHeight = await page.evaluate(() => document.getElementById('description-max').scrollHeight);
      const offsetHeight = await page.evaluate(() => document.getElementById('description-max').offsetHeight);

      expect(scrollHeight).toBeGreaterThan(offsetHeight);
    });

    it('should display dirty tracker if textarea is updated and unfocused', async () => {
      await page.waitForSelector('#description-dirty', { visible: true });

      await page.type('#description-dirty', '1');
      await page.click('#description-max');

      expect(await page.waitForSelector('.icon-dirty', { visible: true })).toBeTruthy();
    });
  });
});
