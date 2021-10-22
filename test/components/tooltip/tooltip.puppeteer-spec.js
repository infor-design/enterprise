const { checkTooltipValue, checkDataAutomationID } = require('../../helpers/e2e-utils.js');

describe('Tooltip Puppeteer Tests', () => {
  // const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  describe('Index tests', () => {
    const url = 'http://localhost:4000/components/tooltip/example-index?theme=classic&mode=light&layout=nofrills';

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea.children[0]).toMatchObject({
        name: 'Component Example Page',
        role: 'heading',
        level: 1
      });
      expect(webArea.children[1]).toMatchObject({
        level: 2,
        name: 'Tooltip Example: Standard Text Tooltip',
        role: 'heading'
      });
      expect(webArea.children[2]).toMatchObject({
        name: 'Normal Tooltip',
        role: 'button'
      });
    });

    it('should display when hovering the button', async () => {
      await page.hover('#tooltip-btn');
      // wait(200);
      await page.waitForTimeout(900);
      const tooltipVal = await page.$eval('#tooltip > div.tooltip-content', el => el.textContent);
      expect(tooltipVal).toEqual('Tooltips Provide Additional Information'); // if this fail add a bit more time out on line 43
    });

    it('should be able to set id/automation id', async () => {
      await page.hover('#tooltip-btn');
      await page.waitForSelector('#tooltip > div.tooltip-content', { visible: true });
      expect(await page.$eval('#tooltip-btn', el => el.id)).toEqual('tooltip-btn');
      expect(await page.$eval('#tooltip', el => el.id)).toEqual('tooltip');

      // get data-automation id
      const isFailed = [];
      isFailed.push(await checkDataAutomationID('#tooltip', 'test-tooltip'));
      isFailed.push(await checkDataAutomationID('#tooltip-btn', 'test-tooltip-trigger'));
      expect(isFailed).not.toContain(true);
    });

    it('should display when tabbing in', async () => {
      await page.click('.six h2');
      await page.keyboard.press('Tab');
      await page.waitForSelector('#tooltip > div.tooltip-content', { visible: true });
      expect(await page.$eval('#tooltip > div.tooltip-content', el => el.textContent)).toEqual('Tooltips Provide Additional Information');
    });

    it('should not display when tabbing through', async () => {
      await page.click('.six h2');
      await page.waitForTimeout(100);
      const btn = await page.$('#tooltip-btn');
      await btn.press('Tab');
      await btn.press('Tab');
      // wait(1000);
      expect(await page.waitForSelector('#tooltip > div.tooltip-content', { visible: false })).toBeTruthy();
      const tooltipval = await page.$eval('#tooltip > div.tooltip-content', el => el.textContent);
      expect(tooltipval).toEqual('');
    });
  });

  describe('Tooltips on icon tests', () => {
    const url = 'http://localhost:4000/components/tooltip/test-svg-icons';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport', 'aria-allowed-role'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea.children[0]).toMatchObject({
        name: 'Skip to Main Content',
        role: 'link',
      });
      expect(webArea.children[1]).toMatchObject({
        level: 1,
        name: 'IDS Enterprise',
        role: 'heading'
      });
      expect(webArea.children[2]).toMatchObject({
        name: 'Header More Actions Button',
        role: 'combobox',
        haspopup: 'menu'
      });
      expect(webArea.children[3]).toMatchObject({
        name: 'Icon Example: Tooltips',
        role: 'heading',
        level: 2
      });
      expect(webArea.children[4]).toMatchObject({
        name: 'Related Issue:',
        role: 'StaticText',
      });
      expect(webArea.children[5]).toMatchObject({
        name: 'Github #400',
        role: 'link',
      });
    });

    it('should display a tooltip when hovering an icon', async () => {
      let hasFailed = false;
      const elHandleArray = await page.$$('.icon.has-tooltip');
      let index = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const elem of elHandleArray) {
        await elem.hover();
        await page.waitForSelector('#tooltip', { visible: true });
        const tooltipval = await page.$eval('#tooltip > div.tooltip-content', el => el.textContent);
        try {
          switch (index) {
            case 0:
              expect(tooltipval).toEqual('Send to Trashcan');
              break;
            case 1:
              expect(tooltipval).toEqual('Send to Inbox');
              break;
            case 2:
              expect(tooltipval).toEqual('View Settings');
              break;
            case 3:
              expect(tooltipval).toEqual('Save to Disk');
              break;
            default:
              hasFailed = true;
              console.warn('No Value Found');
          }
        } catch (error) {
          hasFailed = true;
        }
        index += 1;
      }
      expect(hasFailed).not.toBeTruthy();
    });
  });

  describe('Tooltip (personalizable) tests', () => {
    const url = 'http://localhost:4000/components/header/example-disabled-buttons?theme=soho&variant=dark&colors=206b62';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport', 'landmark-one-main', 'region', 'skip-link'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea.children[0]).toMatchObject({
        name: 'Skip to Main Content',
        role: 'link',
      });
      expect(webArea.children[1]).toMatchObject({
        name: 'Skip to Main Content',
        role: 'link',
      });
      expect(webArea.children[2]).toMatchObject({
        name: 'Application Menu Trigger',
        role: 'button',
      });
      expect(webArea.children[3]).toMatchObject({
        name: 'IDS Enterprise',
        role: 'heading',
        level: 1
      });
      expect(webArea.children[4]).toMatchObject({
        name: 'Save',
        role: 'button',
        disabled: true
      });
      expect(webArea.children[5]).toMatchObject({
        name: 'Undo',
        role: 'button',
      });
      expect(webArea.children[6]).toMatchObject({
        name: 'Header More Actions Button',
        role: 'combobox',
        haspopup: 'menu'
      });
    });

    /* |--------------------------------------------------------------------------------------------------------|
       |  Fixes Github Issue `infor-design/enterprise#3011`                                                     |
       |  Hover the buttons on the top right to activate the tooltip. The text on the tooltip should be white.  |
       |--------------------------------------------------------------------------------------------------------| */
    it('should display a tooltip when hovering a button on the top right', async () => {
      await page.hover('#parameter-maintenance-reset');
      await page.waitForSelector('#tooltip', { visible: true });
      const tooltipval = (await page.$eval('#tooltip', el => el.textContent)).trim();
      expect(tooltipval).toEqual('Undo Edit');
      const tooltipColor = await page.$eval('#tooltip', e => getComputedStyle(e).backgroundColor);
      expect(tooltipColor).toBe('rgb(255, 255, 255)');
    });
  });

  describe('Tooltips icons page tests', () => {
    const url = 'http://localhost:4000/components/tooltip/example-icon-in-tooltip?theme=classic&layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea.children[0]).toMatchObject({
        name: 'Component Example Page',
        role: 'heading',
        level: 1
      });
      expect(webArea.children[1]).toMatchObject({
        level: 2,
        name: 'Tooltip Example: Icons In Tooltips',
        role: 'heading'
      });
      expect(webArea.children[2]).toMatchObject({
        name: 'Add Comment',
        role: 'button'
      });
    });

    it('should display tooltip with icon', async () => {
      await page.hover('#tooltip-btn');
      await page.waitForSelector('#tooltip', { visible: true });
      const iconTooltip = await page.$eval('#tooltip .tooltip-content', element => element.innerHTML);
      expect(iconTooltip).toContain('<use href="#icon-compose"></use>');
    });
  });

  describe('Tooltips with pound sign tests', () => {
    const url = 'http://localhost:4000/components/tooltip/test-tooltip-starts-with-pound-sign?theme=classic&layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea.children[0]).toMatchObject({
        name: 'Component Example Page',
        role: 'heading',
        level: 1
      });
      expect(webArea.children[1]).toMatchObject({
        level: 2,
        name: 'Tooltip Example: Starts with # sign',
        role: 'heading'
      });
      expect(webArea.children[2]).toMatchObject({
        name: 'Normal Tooltip with # Character',
        role: 'button'
      });
    });

    it('should display tooltip with #content', async () => {
      await page.hover('#tooltip-btn');
      await page.waitForSelector('#tooltip', { visible: true });
      const tooltipHandle = await page.$('#tooltip .tooltip-content');
      const tooltipValue = await page.evaluate(el => el.innerHTML, tooltipHandle);
      expect(tooltipValue).toEqual('#Tooltips Provide Additional Information');
    });
  });

  describe('Tooltips Ajax test', () => {
    const url = 'http://localhost:4000/components/tooltip/example-ajax-tooltip?theme=classic&layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea.children[0]).toMatchObject({
        name: 'Component Example Page',
        role: 'heading',
        level: 1
      });
      expect(webArea.children[1]).toMatchObject({
        name: 'Example One',
        role: 'button'
      });
      expect(webArea.children[2]).toMatchObject({
        name: 'Example Two',
        role: 'button'
      });
    });

    it('should display tooltip with #content', async () => {
      const btnIDOne = '.twelve > .btn-secondary:nth-child(1)';
      const btnIDTwo = '.twelve > .btn-secondary:nth-child(2)';
      const tooltip = '#tooltip';
      const tooltipContent = '#tooltip .tooltip-content';
      const expectedValue = 'Tooltips Provide\nInteresting Information';
      const isFailed = [];
      isFailed.push(await checkTooltipValue(btnIDOne, tooltip, tooltipContent, expectedValue));
      isFailed.push(await checkTooltipValue(btnIDTwo, tooltip, tooltipContent, expectedValue));
      expect(isFailed).not.toContain(true);
    });
  });

  describe('Tooltips Extra Css Test', () => {
    const url = 'http://localhost:4000/components/tooltip/example-extra-css-class.html?theme=classic&mode=light&layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea.children[0]).toMatchObject({
        name: 'Component Example Page',
        role: 'heading',
        level: 1
      });
      expect(webArea.children[1]).toMatchObject({
        level: 2,
        name: 'Tooltip Test: Extra CSS Class',
        role: 'heading'
      });
      expect(webArea.children[2]).toMatchObject({
        name: 'Related JIRA Ticket',
        role: 'link'
      });
      expect(webArea.children[3]).toMatchObject({
        name: '. This demonstrates adding extra CSS classes to the tooltip markup by passing a setting through its constructor, `extraClass`.',
        role: 'StaticText'
      });
      expect(webArea.children[4]).toMatchObject({
        name: 'Click Me',
        role: 'button'
      });
    });

    it('should display tooltip with Extra Class', async () => {
      await page.waitForSelector('#tooltip-btn');
      await page.click('#tooltip-btn');
      await page.waitForSelector('.tooltip.TEST-green', { visible: true });
      const tooltipColor = await page.$eval('#tooltip', e => getComputedStyle(e).backgroundColor);
      expect(tooltipColor).toEqual('rgb(72, 132, 33)');

      const extraClass = await page.evaluate(() => !!document.querySelector('.tooltip.TEST-green'));
      if (!extraClass) { console.warn('Extra Class: not Present'); }
      expect(extraClass).toBeTruthy();
    });
  });

  describe('Tooltips as HTML test', () => {
    const url = 'http://localhost:4000/components/tooltip/example-html-tooltip.html?theme=classic&mode=light&layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea.children[0]).toMatchObject({
        name: 'Component Example Page',
        role: 'heading',
        level: 1
      });
      expect(webArea.children[1]).toMatchObject({
        level: 2,
        name: 'Tooltip Test: HTML Tooltip',
        role: 'heading'
      });
      expect(webArea.children[2]).toMatchObject({
        name: 'Custom HTML Tooltip',
        role: 'button'
      });
    });

    it('should show the HTML Tooltip', async () => {
      await page.hover('#button1');
      await page.waitForSelector('#tooltip', { visible: true });
      const iconTooltip = await page.$eval('#tooltip .tooltip-content', element => element.innerHTML);
      expect(iconTooltip).toContain('<span style="text-align: right; display: inline-block;">');
    });
  });

  describe('Tooltips Keep Open test', () => {
    const url = 'http://localhost:4000/components/tooltip/example-keep-open.html?theme=classic&mode=light&layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport', 'color-contrast'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea.children[0]).toMatchObject({
        name: 'Component Example Page',
        role: 'heading',
        level: 1
      });
      expect(webArea.children[1]).toMatchObject({
        level: 2,
        name: 'Tooltip Test: Keep Open Setting',
        role: 'heading'
      });
      expect(webArea.children[2]).toMatchObject({
        name: 'The hyperlink at the end of this sentence has a tooltip built',
        role: 'StaticText'
      });
      expect(webArea.children[3]).toMatchObject({
        name: 'in',
        role: 'link'
      });
      expect(webArea.children[4]).toMatchObject({
        name: '.',
        role: 'StaticText'
      });
    });

    it('should show the HTML Tooltip', async () => {
      await page.hover('#test-link');
      await page.waitForSelector('#tooltip', { visible: true });
      await page.mouse.move(1000, 40);
      expect(await page.waitForSelector('.tooltip.is-open', { visible: true })).toBeTruthy();
    });
  });

  describe('Tooltips On Elements test', () => {
    const url = 'http://localhost:4000/components/tooltip/example-tooltips-on-elements.html?theme=classic&mode=light&layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport', 'aria-allowed-role', 'aria-required-attr', 'color-contrast', 'button-name'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      const root = {
        role: 'RootWebArea',
        name: 'IDS Enterprise',
        children: [
          { role: 'heading', name: 'Component Example Page', level: 1 },
          { role: 'heading', name: 'Tooltip tests', level: 2 },
          { role: 'StaticText', name: 'Email Address' },
          { role: 'textbox', name: 'Email Address' },
          { role: 'StaticText', name: 'First and Last Name' },
          { role: 'textbox', name: 'First and Last Name' },
          { role: 'button', name: 'tooltip here' },
          { role: 'StaticText', name: 'Credit Card' },
          { role: 'textbox', name: 'Credit Card', value: 'xxxx-xxxx-xxxx-xxxx' },
          { role: 'StaticText', name: 'Code' },
          { role: 'textbox', name: 'Code' },
          { role: 'StaticText', name: 'Code' },
          { role: 'StaticText', name: 'Lookup. Press Down arrow to select' },
          { role: 'textbox', name: 'Code Lookup. Press Down arrow to select' },
          { role: 'button', name: 'Lookup Trigger' },
          { role: 'StaticText', name: 'States' },
          { role: 'combobox', name: 'States,', haspopup: 'listbox' },
          { role: 'StaticText', name: 'Editor' },
          { role: 'combobox', name: 'Font Style Normal Text', haspopup: 'menu' },
          { role: 'button', name: 'Bold' },
          { role: 'button', name: 'Italic' },
          { role: 'button', name: 'Underline' },
          { role: 'button', name: 'Strike Through' },
          { role: 'combobox', name: '', value: 'Text color', haspopup: 'listbox' },
          { role: 'button', name: 'Align Left' },
          { role: 'button', name: 'Center' },
          { role: 'button', name: 'Align Right' },
          { role: 'button', name: 'Block quote' },
          { role: 'button', name: 'Insert/Remove Numbered List' },
          { role: 'button', name: 'Insert/Remove Bulleted List' },
          { role: 'button', name: 'Insert Anchor' },
          { role: 'button', name: 'Insert Image' },
          { role: 'button', name: 'Clear Formatting' },
          { role: 'button', name: 'View Source' },
          { role: 'combobox', name: '', haspopup: 'menu' },
          { role: 'textbox', name: 'Editor', multiline: true },
          { role: 'button', name: 'Submit' }
        ]
      };
      expect(webArea).toMatchObject(root);
    });

    it('should show the HTML Tooltip', async () => {
      const txtEMail = '#email-address-ok';
      const txtName = '#firstlastname';
      const txtcreditcard = '#credit-card';
      const txtCode = '#credit-code';
      const txtCode2 = '#credit-code2';
      const dropdown = '#test > div:nth-child(6) > div > div';
      const editor = '.editor.has-tooltip';
      const tooltip = '#tooltip';
      const tooltipOnElement = 'span > #tooltip .tooltip-content';
      const tooltipContent = '#tooltip .tooltip-content';
      const isFailed = [];
      isFailed.push(await checkTooltipValue(txtEMail, tooltip, tooltipContent, 'Enter an email address')); // check if tooltip in email address field is exist
      isFailed.push(await checkTooltipValue(txtName, tooltip, tooltipOnElement, 'Enter your name'));// check if tooltip in first last name field is exist and the tooltip is present on another element
      isFailed.push(await checkTooltipValue(txtcreditcard, tooltip, tooltipContent, 'Enter a credit card number'));// check if tooltip in credit card field is exist
      isFailed.push(await checkTooltipValue(txtCode, tooltip, tooltipContent, 'Enter a credit code'));// check if tooltip in code field is exist
      isFailed.push(await checkTooltipValue(txtCode2, tooltip, tooltipContent, 'Look up a credit code'));// check if tooltip in Look up code field is exist
      isFailed.push(await checkTooltipValue(dropdown, tooltip, tooltipContent, 'Select a state'));// check if tooltip in state dropdown field is exist
      isFailed.push(await checkTooltipValue(editor, tooltip, tooltipContent, 'Enter some rich text'));// check if tooltip in editor field is exist
      expect(isFailed).not.toContain(true);
    }, 10000);
  });

  describe('Tooltips On Trigger Click test', () => {
    const url = 'http://localhost:4000/components/tooltip/example-trigger-click.html?theme=classic&mode=light&layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea.children[0]).toMatchObject({
        name: 'Component Example Page',
        role: 'heading',
        level: 1
      });
      expect(webArea.children[1]).toMatchObject({
        level: 2,
        name: 'Tooltip Test: "Click" Trigger',
        role: 'heading'
      });
      expect(webArea.children[2]).toMatchObject({
        name: 'When a tooltip is used with an "click" trigger, the action of clicking on a Tooltip\'s target element causes the tooltip to show.',
        role: 'StaticText'
      });
      expect(webArea.children[3]).toMatchObject({
        name: 'Click to Display Tooltip',
        role: 'button'
      });
    });

    it('should show the tooltip OnClick', async () => {
      await page.hover('#tooltip-btn');
      expect(await page.waitForSelector('#tooltip', { visible: false })).toBeTruthy();
      await page.click('#tooltip-btn');
      expect(await page.waitForSelector('#tooltip', { visible: true })).toBeTruthy();
      const tooltipValue = await page.$eval('#tooltip .tooltip-content', element => element.innerText);
      expect(tooltipValue).toEqual('This tooltip is displayed on click!');
    });
  });

  describe('Tooltips On Focus test', () => {
    const url = 'http://localhost:4000/components/tooltip/example-trigger-focus.html?theme=classic&mode=light&layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea.children[0]).toMatchObject({
        name: 'Component Example Page',
        role: 'heading',
        level: 1
      });
      expect(webArea.children[1]).toMatchObject({
        level: 2,
        name: 'Tooltip Test: "Focus" Trigger',
        role: 'heading'
      });
      expect(webArea.children[2]).toMatchObject({
        name: 'When a tooltip is used with an "focus" trigger, the action of focusing a Tooltip\'s target element causes the tooltip to show.',
        role: 'StaticText'
      });
      expect(webArea.children[3]).toMatchObject({
        name: 'Show Focus Tooltip',
        role: 'button'
      });
    });

    it('should show the tooltip On Focus', async () => {
      await page.waitForSelector('#tooltip-btn');
      await page.hover('#tooltip-btn');
      expect(await page.waitForSelector('#tooltip', { visible: false })).toBeTruthy();
      await page.focus('#tooltip-btn');
      expect(await page.waitForSelector('#tooltip', { visible: true })).toBeTruthy();
      await page.click('.row > .six > h2');
      expect(await page.waitForSelector('#tooltip', { visible: false })).toBeTruthy();
      await page.keyboard.press('Tab');
      expect(await page.waitForSelector('#tooltip', { visible: true })).toBeTruthy();
      const tooltipValue = await page.$eval('#tooltip .tooltip-content', element => element.innerText);
      expect(tooltipValue).toEqual('This tooltip is displayed on a focus event!');
    });
  });

  describe('Tooltips Trigger Immediate test', () => {
    const url = 'http://localhost:4000/components/tooltip/example-trigger-immediate.html?theme=classic&mode=light&layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea.children[0]).toMatchObject({
        name: 'Component Example Page',
        role: 'heading',
        level: 1
      });
      expect(webArea.children[1]).toMatchObject({
        level: 2,
        name: 'Tooltip Test: "Immediate" Trigger',
        role: 'heading'
      });
      expect(webArea.children[2]).toMatchObject({
        name: 'When a tooltip is used with an "immediate" trigger, as soon as the tooltip is invoked, it will show itself. In this example, the tooltip is being re-invoked on the button click.',
        role: 'StaticText'
      });
      expect(webArea.children[3]).toMatchObject({
        name: 'Show Tooltip',
        role: 'button'
      });
    });

    it('should show the tooltip on Trigger Immediate', async () => {
      await page.waitForSelector('#tooltip-btn');
      await page.hover('#tooltip-btn');
      await page.click('#tooltip-btn');
      expect(await page.waitForSelector('#tooltip', { visible: true })).toBeTruthy();
      const tooltipValue = await page.$eval('#tooltip .tooltip-content', element => element.innerText);
      expect(tooltipValue).toEqual('Activated 1 times!');

      await page.waitForTimeout(200);
      await page.hover('#tooltip-btn');
      await page.click('#tooltip-btn');
      expect(await page.waitForSelector('#tooltip', { visible: true })).toBeTruthy();
      await page.waitForTimeout(200);
      const tooltipValue2 = await page.$eval('#tooltip .tooltip-content', element => element.innerText);
      expect(tooltipValue2).toEqual('Activated 2 times!');
    });
  });

  describe('Tooltips url inside a tooltip', () => {
    const url = 'http://localhost:4000/components/tooltip/example-url-in-tooltip.html?theme=classic&mode=light&layout=nofrills';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea.children[0]).toMatchObject({
        name: 'Component Example Page',
        role: 'heading',
        level: 1
      });
      expect(webArea.children[1]).toMatchObject({
        level: 2,
        name: 'Tooltip Test: Hyperlinks',
        role: 'heading'
      });
      expect(webArea.children[2]).toMatchObject({
        name: 'Example',
        role: 'button'
      });
    });

    it('should show the url on Tooltip', async () => {
      // save target of original page to know that this was the opener:
      const pageTarget = page.target();
      await page.waitForSelector('[data-automation-id="awesome-trigger"]');
      await page.hover('[data-automation-id="awesome-trigger"]');
      expect(await page.waitForSelector('#tooltip', { visible: true })).toBeTruthy();
      const tooltipValue = await page.$eval('#tooltip .tooltip-content', element => element.innerHTML);
      expect(tooltipValue).toContain('<a class="hyperlink links-clickable" data-automation-id="my-hyperlink" href="http://www.infor.com" target="_blank">Infor Website</a>');
      await page.hover('#tooltip');

      // execute click on first tab that triggers opening of new tab:
      await page.waitForSelector('[data-automation-id="my-hyperlink"]');
      await page.click('[data-automation-id="my-hyperlink"]');

      // check that the first page opened this new page:
      const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);
      expect(newTarget).toBeTruthy();

      // get the new page object:
      const newPage = await newTarget.page();
      await expect(newPage.title()).resolves.toMatch('ERP Cloud Software | AI ERP Cloud Products for Enterprise | Infor'); // if this fail just turn on your internet connection
    });
  });
});
