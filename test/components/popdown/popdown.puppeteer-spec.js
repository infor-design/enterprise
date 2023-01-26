const { checkDataAutomationId, checkIfElementHasFocused, checkIfElementExists } = require('../../helpers/e2e-utils.js');
/**
 * #TODO: Refactor all the tests
 */
describe('Popdown Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/popdown';

  describe('Index Tests', () => {
    const url = `${baseUrl}/example-index`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should display on click', async () => {
      await page.click('#popdown-example-trigger');
      await page.waitForSelector('.popdown', { visible: true });

      // using page.$, it will only check the presence of an element vs page.evaluate
      // that will involve the round trip to browser's javascript engine
      const popdown = await page.$('.popdown') !== null;
      expect(popdown).toBeTruthy();
    });

    it('should have id/automation ids', async () => {
      await checkDataAutomationId('#popdown', 'popdown-automation-id');
      await checkDataAutomationId('#popover-listview-example', 'popover-listview-example-automation-id');
      await checkDataAutomationId('#edit-cart', 'edit-cart-automation-id');
      await checkDataAutomationId('#checkout', 'checkout-automation-id');
    });
  });

  describe('Popdown (with Dropdown) Tests', () => {
    const url = `${baseUrl}/test-contains-dropdown`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should keep the Popdown open while focused on an inline-Dropdown component\'s list', async () => {
      const isPopdownVisible = () => !!document.querySelector('.popdown.bottom.visible');

      // Open the Popdown
      await page.click('#popdown-example-trigger');
      await page.waitForFunction(isPopdownVisible);

      // Open the Dropdown List
      await page.click('.popdown div.dropdown');
      await page.waitForSelector('.dropdown-list', { visible: true });

      // Test that the Popdown remained open
      expect(await page.evaluate(isPopdownVisible)).toBeTruthy();

      // Choose an option from the Dropdown, which will close it.
      await page.click('li[data-val="1"]');

      // Test that the Popdown remained open
      expect(await page.evaluate(isPopdownVisible)).toBeTruthy();
    });
  });

  describe.only('Popdown first last tab Tests', () => {
    const url = `${baseUrl}/test-first-last-tab`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    // 1. On open first input should be focused.
    // 2. On first input (Shift + Tab) should close and focus to previous.
    // 3. On last input Tab should close and focus to next.
    it.skip('should let close the popdown and if available focus to prev/next', async () => {
      const tabPresses = 5;

      await Promise.all(Array.from({ length: tabPresses }, () => page.keyboard.press('Tab', { delay: 400 })));
      await page.waitForSelector('.popdown', { visible: true });

      // Popdown should open and first input should be focused.

      const firstName = await page.$('#first-name');

      expect(await checkIfElementExists(page, '.popdown.bottom.visible')).toBe(true);
      expect(await checkIfElementHasFocused('#first-name')).toBe(true);

      // Tab on first input
      await page.keyboard.press('Tab');

      // Last input should be focused in popdown.
      expect(await checkIfElementHasFocused('#last-name')).toBe(true);

      await page.waitForTimeout(400);
      // Tab on last input in popdown
      await page.keyboard.press('Tab');

      expect(await checkIfElementExists(page, '.popdown.bottom.visible')).toBe(false);
      expect(await checkIfElementHasFocused('#another-field')).toBe(true);

      // Shift + Tab on this next to popdown input (another-field)
      const anotherField = await page.$('#another-field');
      await page.keyboard.down('Shift');
      await anotherField.press('Tab');
      await page.keyboard.up('Shift');

      expect(await checkIfElementExists(page, '.popdown.bottom.visible')).toBe(true);
      expect(await checkIfElementHasFocused('#first-name')).toBe(true);

      // Shift + Tab on first input in popdown
      await page.keyboard.down('Shift');
      await firstName.press('Tab');
      await page.keyboard.up('Shift');

      await page.keyboard.down('Shift');
      await page.keyboard.press('Tab', { delay: 100 });
      await page.keyboard.up('Shift');

      // Popdown should close and previous input (date field) should be focused.
      expect(await checkIfElementExists(page, '.popdown.bottom:not(.visible)')).toBe(true);
      expect(await checkIfElementHasFocused('#date-field-normal')).toBe(true);
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

    it('Should remain open when an inner Lookup component is opened', async () => {
      // Open the Popdown
      await page.click('#popdown-trigger');
      expect(await checkIfElementExists(page, '.popdown.bottom.visible')).toBe(true);

      // Open the Lookup
      await page.click('.btn-icon');
      expect(await checkIfElementExists(page, '.lookup-modal')).toBe(true);

      // Test that the Popdown remained open
      expect(await checkIfElementExists(page, '.popdown.bottom.visible'));

      // Choose an option from the Lookup
      await page.click('#lookup-datagrid > div.datagrid-wrapper.center.scrollable-x.scrollable-y > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > a');
      const element = await page.$('#lookup-input');
      const input = await (await element.getProperty('value')).jsonValue();
      expect(input).toBe('2142201');

      expect(await checkIfElementExists(page, '.popdown.bottom.visible')).toBe(true);
    });
  });
});
