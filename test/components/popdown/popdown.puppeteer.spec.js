describe('Popdown Puppeteer Tests', () => {
  describe('Index Tests', () => {
    const url = 'http://localhost:4000/components/popdown/example-index?layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport', 'aria-valid-attr-value', 'region'] });
    });

    it('should display on click', async () => {
      await page.click('#popdown-example-trigger');
      await page.waitForSelector('.popdown', { visible: true });
      const popdown = await page.evaluate(() => !!document.querySelector('.popdown'));
      expect(popdown).toBeTruthy();
    });

    it('should have id/automation ids', async () => {
      let isFailed = false;
      const getIDandCompare = async (el, val) => {
        try {
          const elemHandle = await page.$(el);
          const elemID = await page.evaluate(elem => elem.getAttribute('data-automation-id'), elemHandle);
          expect(elemID).toEqual(val);
        } catch (error) {
          isFailed = true;
        }
      };
      await getIDandCompare('#popdown', 'popdown-automation-id');
      await getIDandCompare('#popover-listview-example', 'popover-listview-example-automation-id');
      await getIDandCompare('#edit-cart', 'edit-cart-automation-id');
      await getIDandCompare('#checkout', 'checkout-automation-id');
      expect(isFailed).toBe(false);
    });
  });

  describe('Popdown (with Dropdown) Tests', () => {
    const url = 'http://localhost:4000/components/popdown/test-contains-dropdown?layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport', 'aria-valid-attr-value', 'region'] });
    });

    it('should keep the Popdown open while focused on an inline-Dropdown component\'s list', async () => {
      // Open the Popdown
      await page.click('#popdown-example-trigger');
      await page.waitForSelector('.popdown', { visible: true });

      // Open the Dropdown List
      await page.click('.popdown div.dropdown');
      await page.waitForSelector('.dropdown-list', { visible: true });

      // Test that the Popdown remained open
      const popdown = await page.evaluate(() => !!document.querySelector('.popdown.bottom.visible'));
      expect(popdown).toBeTruthy();

      // Choose an option from the Dropdown, which will close it.
      await page.click('li[data-val="1"]');
      await page.waitForTimeout(400);

      // Test that the Popdown remained open
      expect(popdown).toBeTruthy();
    });
  });

  describe('Popdown first last tab Tests', () => {
    const url = 'http://localhost:4000/components/popdown/test-first-last-tab?layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport', 'aria-valid-attr-value', 'region'] });
    });

    // 1. On open first input should be focused.
    // 2. On first input (Shift + Tab) should close and focus to previous.
    // 3. On last input Tab should close and focus to next.
    it('should let close the popdown and if available focus to prev/next', async () => {
      // Tab on date field
      const dateField = await page.$('#date-field-normal');
      const dateIcon = await page.$('.btn-icon');
      dateField.click();
      await dateField.press('Tab', { delay: 100 });
      await dateIcon.press('Tab', { delay: 100 });
      await page.waitForSelector('.popdown', { visible: true });

      // Popdown should open and first input should be focused.
      const focusedId = () => page.evaluate(() => document.activeElement.getAttribute('id'));
      const popdown = () => page.evaluate(() => !!document.querySelector('.popdown.bottom.visible'));
      // const firstNameField = () => page.evaluate(() => !!document.querySelector('#first-name'));
      // const lastNameField = () => page.evaluate(() => !!document.querySelector('#last-name'));
      const firstName = await page.$('#first-name');
      const lastName = await page.$('#last-name');
      expect(await popdown()).toBe(true);
      // expect(firstName).toBeTruthy();
      // expect(lastName).toBeTruthy();
      expect(await focusedId()).toEqual('first-name');

      // Tab on first input
      await firstName.press('Tab');

      // Last input should be focused in popdown.
      expect(await focusedId()).toEqual('last-name');
      await page.waitForTimeout(380);
      // Tab on last input in popdown
      await lastName.press('Tab');

      // Popdown should close and next input (another-field) should be focused.
      expect(await popdown()).toBe(false);
      // expect(await firstNameField()).toBeFalsy();
      // expect(await lastNameField()).toBeFalsy();
      expect(await focusedId()).toEqual('another-field');

      // Shift + Tab on this next to popdown input (another-field)
      await page.waitForTimeout(500);
      const anotherField = await page.$('#another-field');
      await page.keyboard.down('Shift');
      await anotherField.press('Tab');
      await page.keyboard.up('Shift');

      // Popdown should open again and first input should be focused.
      expect(await popdown()).toBe(true);
      // expect(await firstNameField()).toBeTruthy();
      // expect(await lastNameField()).toBeTruthy();
      expect(await focusedId()).toEqual('first-name');

      // Shift + Tab on first input in popdown
      await page.waitForTimeout(380);
      await page.keyboard.down('Shift');
      await firstName.press('Tab');
      await page.keyboard.up('Shift');

      await page.waitForTimeout(100);
      await page.keyboard.down('Shift');
      await page.keyboard.press('Tab', { delay: 100 });
      await page.keyboard.up('Shift');

      // Popdown should close and previous input (date field) should be focused.
      expect(await popdown()).toBe(false);
      // expect(await firstNameField()).toBeFalsy();
      // expect(await lastNameField()).toBeFalsy();
      expect(await focusedId()).toEqual('date-field-normal');
    });
  });

  describe('Popdown/Lookup integration Tests', () => {
    const url = 'http://localhost:4000/components/popdown/test-contains-lookup.html?layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport', 'aria-valid-attr-value', 'region'] });
    });

    it('Should remain open when an inner Lookup component is opened', async () => {
    // Open the Popdown
      await page.click('#popdown-trigger');
      // await page.waitForSelector('.popdown.bottom.visible', { visible: true });
      const popdown = () => page.evaluate(() => !!document.querySelector('.popdown.bottom.visible'));
      expect(await popdown()).toBe(true);

      // Open the Lookup
      await page.click('.btn-icon');
      // await page.waitForSelector('.lookup-modal', { visible: true });
      const modal = await page.evaluate(() => !!document.querySelector('.lookup-modal'));
      expect(modal).toBe(true);

      // Test that the Popdown remained open
      expect(await popdown()).toBe(true);

      // Choose an option from the Lookup
      await page.click('#lookup-datagrid > div.datagrid-wrapper.center.scrollable-x.scrollable-y > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > a');
      const element = await page.$('#lookup-input');
      const input = await (await element.getProperty('value')).jsonValue();
      expect(input).toBe('2142201');

      // Test that the Popdown remained open
      expect(await popdown()).toBe(true);
    });
  });

  describe('Outside Event Tests', () => {
    const url = 'http://localhost:4000/components/popdown/test-click-outside.html';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport', 'aria-valid-attr-value', 'region'] });
    });

    it('should show have outside event', async () => {
      // |----------------------------------------------------------|
      // | https://github.com/infor-design/enterprise/issues/3618   |
      // |----------------------------------------------------------|
      page
        .on('console', (message) => {
          expect(message.text()).toContain('click outside');
          const { _type, _text, _args } = message;
          const { _remoteObject } = _args[0];
          const value = _remoteObject.value;
          expect(_type).toBe('log');
          expect(_text).toBe('click outside JSHandle@object');
          expect(value).toBe('click outside');
        });
      await page.click('#popdown-example-trigger');
      await page.waitForSelector('#maincontent');
      await page.click('#maincontent');
      await page.click('[data-automation-id="popover-listview-example-automation-id"]');
    });
  });
});
