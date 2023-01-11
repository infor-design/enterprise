const { checkDataAutomationID, checkIfElementHasFocused, checkIfElementExist } = require('../../helpers/e2e-utils.cjs');
/**
 * #TODO: Refactor all the tests
 */
describe.skip('Popdown Puppeteer Tests', () => {
  describe('Index Tests', () => {
    const url = 'http://localhost:4000/components/popdown/example-index?layout=nofrills';
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should display on click', async () => {
      await page.click('#popdown-example-trigger');
      await page.waitForSelector('.popdown', { visible: true });
      const popdown = await page.evaluate(() => !!document.querySelector('.popdown'));
      expect(popdown).toBeTruthy();
    });

    it('should have id/automation ids', async () => {
      const isFailed = [];
      isFailed.push(await checkDataAutomationID('#popdown', 'popdown-automation-id'));
      isFailed.push(await checkDataAutomationID('#popover-listview-example', 'popover-listview-example-automation-id'));
      isFailed.push(await checkDataAutomationID('#edit-cart', 'edit-cart-automation-id'));
      isFailed.push(await checkDataAutomationID('#checkout', 'checkout-automation-id'));
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Popdown (with Dropdown) Tests', () => {
    const url = 'http://localhost:4000/components/popdown/test-contains-dropdown?layout=nofrills';
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should keep the Popdown open while focused on an inline-Dropdown component\'s list', async () => {
      // Open the Popdown
      await page.click('#popdown-example-trigger');
      await page.waitForSelector('.popdown', { visible: true });

      // Open the Dropdown List
      await page.click('.popdown div.dropdown');
      await page.waitForSelector('.dropdown-list', { visible: true });

      // Test that the Popdown remained open
      const popdown = () => page.evaluate(() => !!document.querySelector('.popdown.bottom.visible'));
      expect(await popdown()).toBeTruthy();

      // Choose an option from the Dropdown, which will close it.
      await page.click('li[data-val="1"]');
      await page.waitForTimeout(400);

      // Test that the Popdown remained open
      expect(await popdown()).toBeTruthy();
    });
  });

  describe('Popdown first last tab Tests', () => {
    const url = 'http://localhost:4000/components/popdown/test-first-last-tab?layout=nofrills';
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    // 1. On open first input should be focused.
    // 2. On first input (Shift + Tab) should close and focus to previous.
    // 3. On last input Tab should close and focus to next.
    it('should let close the popdown and if available focus to prev/next', async () => {
      const isFailed = [];
      // Tab on date field
      const dateField = await page.$('#date-field-normal');
      const dateIcon = await page.$('.btn-icon');
      dateField.click();
      await dateField.press('Tab', { delay: 100 });
      await dateIcon.press('Tab', { delay: 100 });
      await page.waitForSelector('.popdown', { visible: true });

      // Popdown should open and first input should be focused.

      const firstName = await page.$('#first-name');
      const lastName = await page.$('#last-name');

      /* expect(await popdown()).toBe(true);
      expect(await focusedId()).toEqual('first-name'); */
      isFailed.push(await checkIfElementExist('.popdown.bottom.visible'));
      isFailed.push(await checkIfElementHasFocused('#first-name'));

      // Tab on first input
      await firstName.press('Tab');

      // Last input should be focused in popdown.

      /* expect(await focusedId()).toEqual('last-name'); */
      isFailed.push(await checkIfElementHasFocused('#last-name'));

      await page.waitForTimeout(380);
      // Tab on last input in popdown
      await lastName.press('Tab');

      // Popdown should close and next input (another-field) should be focused.

      /* expect(await popdown()).toBe(false);
      expect(await focusedId()).toEqual('another-field'); */
      isFailed.push(!await checkIfElementExist('.popdown.bottom.visible'));
      isFailed.push(await checkIfElementHasFocused('#another-field'));

      // Shift + Tab on this next to popdown input (another-field)
      await page.waitForTimeout(500);
      const anotherField = await page.$('#another-field');
      await page.keyboard.down('Shift');
      await anotherField.press('Tab');
      await page.keyboard.up('Shift');

      // Popdown should open again and first input should be focused.

      isFailed.push(await checkIfElementExist('.popdown.bottom.visible'));
      isFailed.push(await checkIfElementHasFocused('#first-name'));

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

      isFailed.push(!await checkIfElementExist('.popdown.bottom.visible'));
      isFailed.push(await checkIfElementHasFocused('#date-field-normal'));
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Popdown/Lookup integration Tests', () => {
    const url = 'http://localhost:4000/components/popdown/test-contains-lookup.html?layout=nofrills';
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should remain open when an inner Lookup component is opened', async () => {
      const isFailed = [];
      // Open the Popdown
      await page.click('#popdown-trigger');
      isFailed.push(await checkIfElementExist('.popdown.bottom.visible'));

      // Open the Lookup
      await page.click('.btn-icon');
      isFailed.push(await checkIfElementExist('.lookup-modal'));

      // Test that the Popdown remained open
      isFailed.push(await checkIfElementExist('.popdown.bottom.visible'));

      // Choose an option from the Lookup
      await page.click('#lookup-datagrid > div.datagrid-wrapper.center.scrollable-x.scrollable-y > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > a');
      const element = await page.$('#lookup-input');
      const input = await (await element.getProperty('value')).jsonValue();
      expect(input).toBe('2142201');

      // Test that the Popdown remained open
      isFailed.push(await checkIfElementExist('.popdown.bottom.visible'));
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Outside Event Tests', () => {
    const url = 'http://localhost:4000/components/popdown/test-click-outside.html';
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should show have outside event', async () => {
      expect.assertions(8);
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
      await page.click('#maincontent', { delay: 500 });
      await page.click('[data-automation-id="popover-listview-example-automation-id"]', { delay: 500 });
    });
  });
});
