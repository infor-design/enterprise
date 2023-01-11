const { AxePuppeteer } = require('@axe-core/puppeteer');

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
      const results = await new AxePuppeteer(page).disableRules(['meta-viewport']).analyze();
      expect(results.violations.length).toBe(0);
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

      for (let i = 0; i < 5; i++) {
        page.keyboard.press('Enter');
      }

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

  describe('Sizes', () => {
    const url = `${baseUrl}/example-sizes`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.setViewport({ width: 1200, height: 800 });
    });

    it('should support check sizes', async () => {
      await page.evaluate(() => document.getElementById('sm-textarea-example').offsetWidth)
        .then(width => expect(width).toBe(150));

      await page.evaluate(() => document.getElementById('def-textarea-example').offsetWidth)
        .then(width => expect(width).toBe(300));

      await page.evaluate(() => document.getElementById('lg-textarea-example').offsetWidth)
        .then(width => expect(width).toBe(400));

      await page.evaluate(() => document.getElementById('responsive').offsetWidth)
        .then(width => expect(width).toBeGreaterThan(950));
    });
  });

  describe('Auto grow', () => {
    const url = `${baseUrl}/example-autogrow`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should support auto grow', async () => {
      expect(await page.waitForSelector('#autogrow', { visible: true })).toBeTruthy();

      for (let i = 0; i < 7; i++) {
        await page.type('#autogrow', 'Test');
        await page.keyboard.press('Enter');
      }

      const height = await page.evaluate(() => document.getElementById('autogrow').offsetHeight);
      expect(height).toBeGreaterThan(175);
      expect(height).toBeLessThan(185);
    });
  });

  describe('Modal', () => {
    const url = `${baseUrl}/test-modal`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should not close a modal when hitting enter', async () => {
      await page.click('#button-1');
      await page.waitForSelector('.modal-engaged', { visible: true });

      for (let i = 0; i < 2; i++) {
        await page.type('#context-desc', 'Test');
        await page.keyboard.press('Enter');
      }

      const text = await page.evaluate(() => document.getElementById('context-desc').value);

      expect(text.replace(/(\r\n\t|\n|\r\t)/gm, '')).toBe('TestTest');
      expect(await page.waitForSelector('#modal-1', { visible: true })).toBeTruthy();
    });
  });

  describe('Translation', () => {
    const url = `${baseUrl}/example-index?locale=af-ZA`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should translate the count text', async () => {
      await page.evaluate(() => document.querySelector('.textarea-wordcount').textContent)
        .then(text => expect(text).toEqual('Oorblywende karakters 82'));

      await page.waitForSelector('#description-max', { visible: true });
      await page.type('#description-max', 'Test');

      await page.evaluate(() => document.querySelector('.textarea-wordcount').textContent)
        .then(text => expect(text).toEqual('Oorblywende karakters 78'));
    });
  });
});
