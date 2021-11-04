// eslint-disable-next-line camelcase
const { checkInnerHTMLValue, checkDataAutomationID, checkIfElementExist, checkClassNameValue, checkTooltipValue, checkElementCssProperty, checkListItem_1stnLastValue } = require('../../helpers/e2e-utils.js');

describe('Pager Puppeteer Tests', () => {
  describe('Standalone tests', () => {
    const url = 'http://localhost:4000/components/pager/example-standalone.html';
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport', 'label'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea).toMatchInlineSnapshot(`
Object {
  "children": Array [
    Object {
      "name": "Skip to Main Content",
      "role": "link",
    },
    Object {
      "level": 1,
      "name": "IDS Enterprise",
      "role": "heading",
    },
    Object {
      "haspopup": "menu",
      "name": "Header More Actions Button",
      "role": "combobox",
    },
    Object {
      "name": "First Page",
      "role": "button",
    },
    Object {
      "name": "Previous Page",
      "role": "button",
    },
    Object {
      "name": "Next Page",
      "role": "button",
    },
    Object {
      "name": "Last Page",
      "role": "button",
    },
    Object {
      "checked": false,
      "name": "Show Page Size Selector",
      "role": "checkbox",
    },
    Object {
      "name": "Show Page Size Selector",
      "role": "StaticText",
    },
    Object {
      "checked": false,
      "disabled": true,
      "name": "Use Small Page Size Selector",
      "role": "checkbox",
    },
    Object {
      "name": "Use Small Page Size Selector",
      "role": "StaticText",
    },
    Object {
      "checked": false,
      "disabled": true,
      "name": "Attach Page Size Menu To Body",
      "role": "checkbox",
    },
    Object {
      "name": "Attach Page Size Menu To Body",
      "role": "StaticText",
    },
    Object {
      "checked": false,
      "name": "Hide First Button",
      "role": "checkbox",
    },
    Object {
      "name": "Hide First Button",
      "role": "StaticText",
    },
    Object {
      "checked": false,
      "name": "Disable First Button",
      "role": "checkbox",
    },
    Object {
      "name": "Disable First Button",
      "role": "StaticText",
    },
    Object {
      "checked": false,
      "name": "Hide Previous Button",
      "role": "checkbox",
    },
    Object {
      "name": "Hide Previous Button",
      "role": "StaticText",
    },
    Object {
      "checked": false,
      "name": "Disable Previous Button",
      "role": "checkbox",
    },
    Object {
      "name": "Disable Previous Button",
      "role": "StaticText",
    },
    Object {
      "checked": false,
      "name": "Hide Next Button",
      "role": "checkbox",
    },
    Object {
      "name": "Hide Next Button",
      "role": "StaticText",
    },
    Object {
      "checked": false,
      "name": "Disable Next Button",
      "role": "checkbox",
    },
    Object {
      "name": "Disable Next Button",
      "role": "StaticText",
    },
    Object {
      "checked": false,
      "name": "Hide Last Button",
      "role": "checkbox",
    },
    Object {
      "name": "Hide Last Button",
      "role": "StaticText",
    },
    Object {
      "checked": false,
      "name": "Disable Last Button",
      "role": "checkbox",
    },
    Object {
      "name": "Disable Last Button",
      "role": "StaticText",
    },
    Object {
      "checked": false,
      "name": "Show Page Selector Input",
      "role": "checkbox",
    },
    Object {
      "name": "Show Page Selector Input",
      "role": "StaticText",
    },
    Object {
      "name": "First Pager Button Tooltip",
      "role": "StaticText",
    },
    Object {
      "name": "First Pager Button Tooltip Previous Pager Button Tooltip Next Pager Button Tooltip Last Pager Button Tooltip",
      "role": "textbox",
      "value": "Custom First Tooltip",
    },
    Object {
      "name": "Previous Pager Button Tooltip",
      "role": "StaticText",
    },
    Object {
      "name": "",
      "role": "textbox",
      "value": "Custom Previous Tooltip",
    },
    Object {
      "name": "Next Pager Button Tooltip",
      "role": "StaticText",
    },
    Object {
      "name": "",
      "role": "textbox",
      "value": "Custom Next Tooltip",
    },
    Object {
      "name": "Last Pager Button Tooltip",
      "role": "StaticText",
    },
    Object {
      "name": "",
      "role": "textbox",
      "value": "Custom Last Tooltip",
    },
    Object {
      "name": "Reset Tooltips",
      "role": "button",
    },
  ],
  "name": "IDS Enterprise",
  "role": "RootWebArea",
}
`);
    });

    it('should be able to set id/automation id', async () => {
      const btnEl = await page.$('[for="toggle-pagesize"]');
      await btnEl.click();
      const isFailed = [];
      isFailed.push(await checkDataAutomationID('#standalone-pager-btn-first', 'standalone-pager-auto-id-btn-first'));
      isFailed.push(await checkDataAutomationID('#standalone-pager', 'standalone-pager-auto-id'));
      isFailed.push(await checkDataAutomationID('#standalone-pager-btn-prev', 'standalone-pager-auto-id-btn-prev'));
      isFailed.push(await checkDataAutomationID('#standalone-pager-btn-next', 'standalone-pager-auto-id-btn-next'));
      isFailed.push(await checkDataAutomationID('#standalone-pager-btn-last', 'standalone-pager-auto-id-btn-last'));
      isFailed.push(await checkDataAutomationID('#standalone-pager-btn-pagesize', 'standalone-pager-auto-id-btn-pagesize'));
      isFailed.push(await checkDataAutomationID('#standalone-pager-pagesize-opt-10', 'standalone-pager-auto-id-pagesize-opt-10'));
      isFailed.push(await checkDataAutomationID('#standalone-pager-pagesize-opt-20', 'standalone-pager-auto-id-pagesize-opt-20'));
      isFailed.push(await checkDataAutomationID('#standalone-pager-pagesize-opt-30', 'standalone-pager-auto-id-pagesize-opt-30'));
      isFailed.push(await checkDataAutomationID('#standalone-pager-pagesize-opt-40', 'standalone-pager-auto-id-pagesize-opt-40'));
      expect(isFailed).not.toContain(true);
    });

    it('should toggle page size selector', async () => {
      const isFailed = [];
      const pagesizeButton = '#standalone-pager-btn-pagesize';
      const disabledCheckbox = 'input[disabled]';
      isFailed.push(!await checkIfElementExist(pagesizeButton)); // 10 records per page button
      isFailed.push(await checkIfElementExist(disabledCheckbox)); // disabled checkboxes

      // verify pagesize button should be displayed and checkboxes should not be disabled
      await page.click('#toggle-pagesize');
      isFailed.push(await checkIfElementExist(pagesizeButton));
      isFailed.push(!await checkIfElementExist(disabledCheckbox));
      expect(isFailed).not.toContain(true);
    });

    it('should Use Small Page Size Selector', async () => {
      const isFailed = [];
      const pagesizeButton = '#standalone-pager-btn-pagesize';

      // verify Use Small Page Size Selector  when clicked it should show 10
      await page.click('#toggle-pagesize');
      isFailed.push(await checkInnerHTMLValue(pagesizeButton, '<span>10 Records per page</span>'));
      await page.click('#toggle-small-pagesize');
      isFailed.push(await checkInnerHTMLValue(pagesizeButton, '<span class="record-count">10</span>'));
      isFailed.push(await checkInnerHTMLValue(pagesizeButton, '<span class="audible">Records per page</span>'));
      expect(isFailed).not.toContain(true);
    });

    it('should Attach Page Size Menu To Body', async () => {
      const isFailed = [];
      await page.click('#toggle-pagesize');
      await page.click('#toggle-small-pagesize');
      const pagerContainer = 'div.pager-container > #standalone-pager > li.pager-pagesize > div';
      const bodyContainer = 'body > div.popupmenu-wrapper.bottom > ul#popupmenu-2';

      // verify Attach Page Size Menu To Body
      isFailed.push(await checkIfElementExist(pagerContainer));
      await page.click('#toggle-attach-to-body');
      isFailed.push(await checkIfElementExist(bodyContainer));
      expect(isFailed).not.toContain(true);
    });

    it('should hide/show nav buttons', async () => {
      const isFailed = [];
      const hidefirstCheckbox = await page.$('#toggle-first-button');
      const hidepreviousCheckbox = await page.$('#toggle-previous-button');
      const hidenextCheckbox = await page.$('#toggle-next-button');
      const hidelastCheckbox = await page.$('#toggle-last-button');
      const firstPager = '#standalone-pager-btn-first';
      const previousPager = '#standalone-pager-btn-prev';
      const nextPager = '#standalone-pager-btn-next';
      const lastPager = '#standalone-pager-btn-last';

      // hide/show first Nav button
      isFailed.push(await checkIfElementExist(firstPager));
      await hidefirstCheckbox.click();
      isFailed.push(!await checkIfElementExist(firstPager));
      await hidefirstCheckbox.click();
      isFailed.push(await checkIfElementExist(firstPager));

      // hide/show previous Nav button
      isFailed.push(await checkIfElementExist(previousPager));
      await hidepreviousCheckbox.click();
      isFailed.push(!await checkIfElementExist(previousPager));
      await hidepreviousCheckbox.click();
      isFailed.push(await checkIfElementExist(previousPager));

      // hide/show next Nav button
      isFailed.push(await checkIfElementExist(nextPager));
      await hidenextCheckbox.click();
      isFailed.push(!await checkIfElementExist(nextPager));
      await hidenextCheckbox.click();
      isFailed.push(await checkIfElementExist(nextPager));

      // hide/show last Nav button
      isFailed.push(await checkIfElementExist(lastPager));
      await hidelastCheckbox.click();
      isFailed.push(!await checkIfElementExist(lastPager));
      await hidelastCheckbox.click();
      isFailed.push(await checkIfElementExist(lastPager));
      expect(isFailed).not.toContain(true);
    });

    it('should enable/disable navbuttons', async () => {
      const isFailed = [];
      const disableFirst = await page.$('#disable-first-button');
      const disablePrev = await page.$('#disable-previous-button');
      const disableNext = await page.$('#disable-next-button');
      const disableLast = await page.$('#disable-last-button');

      // enable/disable first nav button
      isFailed.push(await checkClassNameValue('.pager-first', 'pager-first'));
      await disableFirst.click();
      isFailed.push(await checkClassNameValue('.pager-first', 'pager-first is-disabled'));

      // enable/disable prev nav button
      isFailed.push(await checkClassNameValue('.pager-prev', 'pager-prev'));
      await disablePrev.click();
      isFailed.push(await checkClassNameValue('.pager-prev', 'pager-prev is-disabled'));

      // enable/disable next nav button
      isFailed.push(await checkClassNameValue('.pager-next', 'pager-next'));
      await disableNext.click();
      isFailed.push(await checkClassNameValue('.pager-next', 'pager-next is-disabled'));

      // enable/disable last nav button
      isFailed.push(await checkClassNameValue('.pager-last', 'pager-last'));
      await disableLast.click();
      isFailed.push(await checkClassNameValue('.pager-last', 'pager-last is-disabled'));
      expect(isFailed).not.toContain(true);
    });

    it('should show Page Selector Input', async () => {
      const isFailed = [];
      const showpageselectorinputCheckbox = await page.$('#show-page-selector-input');

      isFailed.push(await checkClassNameValue('.pager-first', 'pager-first'));
      isFailed.push(await checkClassNameValue('.pager-prev', 'pager-prev'));
      await showpageselectorinputCheckbox.click();
      isFailed.push(await checkClassNameValue('.pager-first', 'pager-first is-disabled'));
      isFailed.push(await checkClassNameValue('.pager-prev', 'pager-prev is-disabled'));
      isFailed.push(await checkIfElementExist('.pager-count'));

      expect(isFailed).not.toContain(true);
    });

    it('should set pager buttons tooltip', async () => {
      const isFailed = [];
      const firstPager = '#standalone-pager-btn-first';
      const previousPager = '#standalone-pager-btn-prev';
      const nextPager = '#standalone-pager-btn-next';
      const lastPager = '#standalone-pager-btn-last';
      const tooltip = '#tooltip';
      const tooltipContent = '#tooltip .tooltip-content';
      const firstpageInput = await page.$('#firstPageButtonTooltip');
      const previouspageInput = await page.$('#previousPageButtonTooltip');
      const nextpageInput = await page.$('#nextPageButtonTooltip');
      const lastpageInput = await page.$('#lastPageButtonTooltip');
      const resetTooltip = await page.$('#reset-tooltips');

      // set tooltip for First Pager Button Tooltip
      isFailed.push(await checkTooltipValue(firstPager, tooltip, tooltipContent, 'Custom First Tooltip'));
      await firstpageInput.click({ clickCount: 3 });
      await firstpageInput.type('The quick brown fox jumps over the lazy dog');
      await firstpageInput.press('Enter');
      isFailed.push(await checkTooltipValue(firstPager, tooltip, tooltipContent, 'The quick brown fox jumps over the lazy dog'));

      // set tooltip for Previous Pager Button Tooltip
      isFailed.push(await checkTooltipValue(previousPager, tooltip, tooltipContent, 'Custom Previous Tooltip'));
      await previouspageInput.click({ clickCount: 3 });
      await previouspageInput.type('Jaded zombies acted quaintly but kept driving their oxen forward');
      await previouspageInput.press('Enter');
      isFailed.push(await checkTooltipValue(previousPager, tooltip, tooltipContent, 'Jaded zombies acted quaintly but kept driving their oxen forward'));

      // set tooltip for Next Pager Button Tooltip
      isFailed.push(await checkTooltipValue(nextPager, tooltip, tooltipContent, 'Custom Next Tooltip'));
      await nextpageInput.click({ clickCount: 3 });
      await nextpageInput.type('Portez ce vieux whisky au juge blond qui fume');
      await nextpageInput.press('Enter');
      isFailed.push(await checkTooltipValue(nextPager, tooltip, tooltipContent, 'Portez ce vieux whisky au juge blond qui fume'));

      // set tooltip for Last Pager Button Tooltip
      isFailed.push(await checkTooltipValue(lastPager, tooltip, tooltipContent, 'Custom Last Tooltip'));
      await lastpageInput.click({ clickCount: 3 });
      await lastpageInput.type('Ang bawat rehistradong kalahok sa patimpalak ay umaasang magantimpalaan ng ñino');
      await lastpageInput.press('Enter');
      isFailed.push(await checkTooltipValue(lastPager, tooltip, tooltipContent, 'Ang bawat rehistradong kalahok sa patimpalak ay umaasang magantimpalaan ng ñino'));

      // Reset Tooltips
      await resetTooltip.click();
      isFailed.push(await checkTooltipValue(firstPager, tooltip, tooltipContent, 'Custom First Tooltip'));
      isFailed.push(await checkTooltipValue(previousPager, tooltip, tooltipContent, 'Custom Previous Tooltip'));
      isFailed.push(await checkTooltipValue(nextPager, tooltip, tooltipContent, 'Custom Next Tooltip'));
      isFailed.push(await checkTooltipValue(lastPager, tooltip, tooltipContent, 'Custom Last Tooltip'));
      expect(isFailed).not.toContain(true);
    }, 13000);
  });

  describe('Index Tests', () => {
    const url = 'http://localhost:4000/components/pager/example-index.html';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport', 'label', 'aria-allowed-role', 'aria-required-parent'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea).toMatchInlineSnapshot(`
Object {
  "children": Array [
    Object {
      "name": "Skip to Main Content",
      "role": "link",
    },
    Object {
      "level": 1,
      "name": "IDS Enterprise",
      "role": "heading",
    },
    Object {
      "haspopup": "menu",
      "name": "Header More Actions Button",
      "role": "combobox",
    },
    Object {
      "children": Array [
        Object {
          "name": "Item One",
          "role": "option",
        },
        Object {
          "name": "Item Two",
          "role": "option",
        },
        Object {
          "name": "Item Three",
          "role": "option",
        },
        Object {
          "name": "Item Four",
          "role": "option",
        },
        Object {
          "name": "Item Five",
          "role": "option",
        },
        Object {
          "name": "Item Six",
          "role": "option",
        },
        Object {
          "name": "Item Seven",
          "role": "option",
        },
        Object {
          "name": "Item Eight",
          "role": "option",
        },
      ],
      "name": "Pagination",
      "role": "region",
    },
    Object {
      "disabled": true,
      "name": "Previous Page",
      "role": "button",
    },
    Object {
      "disabled": true,
      "name": "You are currently on page 1",
      "role": "button",
    },
    Object {
      "name": "page 2",
      "role": "button",
    },
    Object {
      "name": "page 3",
      "role": "button",
    },
    Object {
      "name": "Next Page",
      "role": "button",
    },
  ],
  "name": "IDS Enterprise",
  "role": "RootWebArea",
}
`);
    });

    it('should check pager onClick', async () => {
      const isFailed = [];
      const pagerNext = 'li.pager-next';
      const pagerPrev = 'li.pager-prev';
      const page1 = 'button[data-page="1"]';
      const page2 = 'button[data-page="2"]';
      const page3 = 'button[data-page="3"]';
      const list = 'ul.paginated.listview.is-selectable > li';

      // verify default
      isFailed.push(await checkIfElementExist('li.pager-prev > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerNext));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '600'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '400'));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Item One', 'Item Eight')); // check if  List's first and last items contains the given value

      // verify page 2
      await page.click(page2);
      isFailed.push(!await checkIfElementExist('li.pager-prev > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerPrev));
      isFailed.push(await checkIfElementExist(pagerNext));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '600'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '400'));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Item Nine', 'Item Sixteen')); // check if  List's first and last items contains the given value

      // verify page 3
      await page.click(page3);
      isFailed.push(await checkIfElementExist('li.pager-next > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerPrev));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '600'));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Item Seventeen', 'Item Twenty Three')); // check if  List's first and last items contains the given value
      expect(isFailed).not.toContain(true); // check if each assertions fails
    });

    it('should check pager using keyboard press', async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
      const isFailed = [];
      const pagerNext = 'li.pager-next';
      const pagerPrev = 'li.pager-prev';
      const page1 = 'button[data-page="1"]';
      const page2 = 'button[data-page="2"]';
      const page3 = 'button[data-page="3"]';
      const list = 'ul.paginated.listview.is-selectable > li';

      // verify default
      isFailed.push(await checkIfElementExist('li.pager-prev > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerNext));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '600'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '400'));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Item One', 'Item Eight')); // check if  List's first and last items contains the given value

      // verify page 2
      const pager1 = await page.$('button[data-page="1"]');
      await pager1.press('Tab');
      await pager1.press('Tab');
      await page.keyboard.press('Enter');
      isFailed.push(!await checkIfElementExist('li.pager-prev > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerPrev));
      isFailed.push(await checkIfElementExist(pagerNext));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '600'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '400'));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Item Nine', 'Item Sixteen')); // check if  List's first and last items contains the given value

      // verify page 3
      const pager2 = await page.$('button[data-page="2"]');
      await pager2.press('Tab');
      await pager2.press('Tab');
      await page.keyboard.press('Enter');
      isFailed.push(await checkIfElementExist('li.pager-next > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerPrev));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '600'));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Item Seventeen', 'Item Twenty Three')); // check if  List's first and last items contains the given value
      expect(isFailed).not.toContain(true); // check if each assertions fails
    });

    it('should check pager next and previous buttons', async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
      const isFailed = [];
      const pagerNext = 'li.pager-next';
      const pagerPrev = 'li.pager-prev';
      const page1 = 'button[data-page="1"]';
      const page2 = 'button[data-page="2"]';
      const page3 = 'button[data-page="3"]';
      const list = 'ul.paginated.listview.is-selectable > li';

      // verify default
      isFailed.push(await checkIfElementExist('li.pager-prev > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerNext));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '600'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '400'));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Item One', 'Item Eight')); // check if  List's first and last items contains the given value

      // verify page 2
      await page.click('li.pager-next');
      isFailed.push(!await checkIfElementExist('li.pager-prev > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerPrev));
      isFailed.push(await checkIfElementExist(pagerNext));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '600'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '400'));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Item Nine', 'Item Sixteen')); // check if  List's first and last items contains the given value

      // verify page 3
      await page.click('li.pager-next');
      isFailed.push(await checkIfElementExist('li.pager-next > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerPrev));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '600'));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Item Seventeen', 'Item Twenty Three')); // check if  List's first and last items contains the given value

      // verify go back to page 2
      await page.click('li.pager-prev');
      isFailed.push(!await checkIfElementExist('li.pager-next > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerPrev));
      isFailed.push(await checkIfElementExist(pagerNext));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '600'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '400'));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Item Nine', 'Item Sixteen')); // check if  List's first and last items contains the given value

      // verify go back to page 1
      await page.click('li.pager-prev');
      isFailed.push(await checkIfElementExist('li.pager-prev > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerNext));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '600'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '400'));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Item One', 'Item Eight')); // check if  List's first and last items contains the given value
      expect(isFailed).not.toContain(true); // check if each assertions fails
    });
  });

  describe('Listview Tests', () => {
    const url = 'http://localhost:4000/components/pager/example-listview.html';
    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport', 'label', 'aria-allowed-role', 'aria-required-parent'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea).toMatchInlineSnapshot(`
Object {
  "children": Array [
    Object {
      "name": "Skip to Main Content",
      "role": "link",
    },
    Object {
      "level": 1,
      "name": "IDS Enterprise",
      "role": "heading",
    },
    Object {
      "haspopup": "menu",
      "name": "Header More Actions Button",
      "role": "combobox",
    },
    Object {
      "level": 2,
      "name": "Pagable Listview",
      "role": "heading",
    },
    Object {
      "children": Array [
        Object {
          "children": Array [
            Object {
              "name": "8 Mile Resurfacing City of Detroit",
              "role": "option",
            },
            Object {
              "name": "Bishop Park City of Detroit",
              "role": "option",
            },
            Object {
              "name": "Fort Woods Swimming Pool City of Dearborn",
              "role": "option",
            },
            Object {
              "name": "Maplewood St. Resurfacing Garden City",
              "role": "option",
            },
            Object {
              "name": "Middle School Parking Lot Cinnaminson Township",
              "role": "option",
            },
            Object {
              "name": "Wood Park Tennis Court Cinnaminson Township",
              "role": "option",
            },
            Object {
              "name": "Beechtree Dr. Resurfacing Cinnaminson Township",
              "role": "option",
            },
            Object {
              "name": "Track Resurfacing Maple Shade Boro",
              "role": "option",
            },
            Object {
              "name": "8 Mile Resurfacing City of Detroit",
              "role": "option",
            },
            Object {
              "name": "Bishop Park City of Detroit",
              "role": "option",
            },
          ],
          "name": "Pagable Listview",
          "role": "listbox",
        },
      ],
      "name": "[Pagination]",
      "role": "region",
    },
    Object {
      "disabled": true,
      "name": "[PreviousPage]",
      "role": "button",
    },
    Object {
      "disabled": true,
      "name": "[PageOn] 1",
      "role": "button",
    },
    Object {
      "name": "[Page] 2",
      "role": "button",
    },
    Object {
      "name": "[Page] 3",
      "role": "button",
    },
    Object {
      "name": "[NextPage]",
      "role": "button",
    },
  ],
  "name": "IDS Enterprise",
  "role": "RootWebArea",
}
`);
    });

    it('should check pager onClick', async () => {
      const isFailed = [];
      const pagerNext = 'li.pager-next';
      const pagerPrev = 'li.pager-prev';
      const page1 = 'button[data-page="1"]';
      const page2 = 'button[data-page="2"]';
      const page3 = 'button[data-page="3"]';
      const list = 'div.paginated.listview.is-selectable > ul > li';

      // verify default
      isFailed.push(await checkIfElementExist('li.pager-prev > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerNext));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '600'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '400'));
      isFailed.push(await checkListItem_1stnLastValue(list, '8 Mile Resurfacing', 'Bishop Park')); // check if  List's first and last items contains the given value

      // verify page 2
      await page.click(page2);
      isFailed.push(!await checkIfElementExist('li.pager-prev > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerPrev));
      isFailed.push(await checkIfElementExist(pagerNext));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '600'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '400'));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Fort Woods Swimming Pool', 'Maplewood St. Resurfacing')); // check if  List's first and last items contains the given value

      // verify page 3
      await page.click(page3);
      isFailed.push(await checkIfElementExist('li.pager-next > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerPrev));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '600'));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Middle School Parking Lot', 'Track Resurfacing')); // check if  List's first and last items contains the given value
      expect(isFailed).not.toContain(true); // check if each assertions fails
    });

    it('should check pager using keyboard press', async () => {
      const isFailed = [];
      const pagerNext = 'li.pager-next';
      const pagerPrev = 'li.pager-prev';
      const page1 = 'button[data-page="1"]';
      const page2 = 'button[data-page="2"]';
      const page3 = 'button[data-page="3"]';
      const list = 'ul.paginated.listview.is-selectable > li';

      // verify default
      isFailed.push(await checkIfElementExist('li.pager-prev > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerNext));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '600'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '400'));
      isFailed.push(await checkListItem_1stnLastValue(list, '8 Mile Resurfacing', 'Bishop Park')); // check if  List's first and last items contains the given value

      // verify page 2
      const pager1 = await page.$('button[data-page="1"]');
      await pager1.press('Tab');
      await pager1.press('Tab');
      await page.keyboard.press('Enter');
      isFailed.push(!await checkIfElementExist('li.pager-prev > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerPrev));
      isFailed.push(await checkIfElementExist(pagerNext));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '600'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '400'));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Fort Woods Swimming Pool', 'Maplewood St. Resurfacing')); // check if  List's first and last items contains the given value

      // verify page 3
      const pager2 = await page.$('button[data-page="2"]');
      await pager2.press('Tab');
      await pager2.press('Tab');
      await page.keyboard.press('Enter');
      isFailed.push(await checkIfElementExist('li.pager-next > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerPrev));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '600'));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Middle School Parking Lot', 'Track Resurfacing')); // check if  List's first and last items contains the given value
      expect(isFailed).not.toContain(true); // check if each assertions fails
    });

    it('should check pager next and previous buttons', async () => {
      const isFailed = [];
      const pagerNext = 'li.pager-next';
      const pagerPrev = 'li.pager-prev';
      const page1 = 'button[data-page="1"]';
      const page2 = 'button[data-page="2"]';
      const page3 = 'button[data-page="3"]';
      const list = 'ul.paginated.listview.is-selectable > li';

      // verify default
      isFailed.push(await checkIfElementExist('li.pager-prev > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerNext));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '600'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '400'));
      isFailed.push(await checkListItem_1stnLastValue(list, '8 Mile Resurfacing', 'Bishop Park')); // check if  List's first and last items contains the given value

      // verify page 2
      await page.click('li.pager-next');
      isFailed.push(!await checkIfElementExist('li.pager-prev > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerPrev));
      isFailed.push(await checkIfElementExist(pagerNext));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '600'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '400'));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Fort Woods Swimming Pool', 'Maplewood St. Resurfacing')); // check if  List's first and last items contains the given value

      // verify page 3
      await page.click('li.pager-next');
      isFailed.push(await checkIfElementExist('li.pager-next > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerPrev));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '600'));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Middle School Parking Lot', 'Track Resurfacing')); // check if  List's first and last items contains the given value

      // verify go back to page 2
      await page.click('li.pager-prev');
      isFailed.push(!await checkIfElementExist('li.pager-next > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerPrev));
      isFailed.push(await checkIfElementExist(pagerNext));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '600'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '400'));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Fort Woods Swimming Pool', 'Maplewood St. Resurfacing')); // check if  List's first and last items contains the given value

      // verify go back to page 1
      await page.click('li.pager-prev');
      isFailed.push(await checkIfElementExist('li.pager-prev > button[disabled]'));
      isFailed.push(await checkIfElementExist(pagerNext));
      isFailed.push(await checkElementCssProperty(page1, 'fontWeight', '600'));
      isFailed.push(await checkElementCssProperty(page2, 'fontWeight', '400'));
      isFailed.push(await checkElementCssProperty(page3, 'fontWeight', '400'));
      isFailed.push(await checkListItem_1stnLastValue(list, '8 Mile Resurfacing', 'Bishop Park')); // check if  List's first and last items contains the given value
      expect(isFailed).not.toContain(true); // check if each assertions fails
    });
  });

  describe('Datagrid Tests', () => {
    const url = 'http://localhost:4000/components/pager/example-datagrid.html';
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should check the test page with Axe', async () => {
      await page.setBypassCSP(true);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await expect(page).toPassAxeTests({ disabledRules: ['meta-viewport', 'label', 'aria-allowed-role', 'aria-required-parent', 'aria-allowed-attr'] });
    });

    it('should have Accessibility', async () => {
      const webArea = await page.accessibility.snapshot();
      expect(webArea).toMatchInlineSnapshot(`
Object {
  "children": Array [
    Object {
      "name": "Skip to Main Content",
      "role": "link",
    },
    Object {
      "level": 1,
      "name": "IDS Enterprise",
      "role": "heading",
    },
    Object {
      "haspopup": "menu",
      "name": "Header More Actions Button",
      "role": "combobox",
    },
    Object {
      "name": "Data Grid Header Title",
      "role": "StaticText",
    },
    Object {
      "name": "(all 1000)",
      "role": "StaticText",
    },
    Object {
      "haspopup": "menu",
      "name": "Grid Features",
      "role": "combobox",
    },
    Object {
      "checked": false,
      "name": "Selection",
      "role": "checkbox",
    },
    Object {
      "name": "Id",
      "role": "StaticText",
    },
    Object {
      "name": "Filter",
      "role": "button",
    },
    Object {
      "name": "Id",
      "role": "StaticText",
    },
    Object {
      "name": "Id",
      "role": "textbox",
    },
    Object {
      "name": "Product Id",
      "role": "StaticText",
    },
    Object {
      "name": "Filter",
      "role": "button",
    },
    Object {
      "name": "Product Id",
      "role": "StaticText",
    },
    Object {
      "name": "Product Id",
      "role": "textbox",
    },
    Object {
      "name": "Product Name",
      "role": "StaticText",
    },
    Object {
      "name": "Filter",
      "role": "button",
    },
    Object {
      "name": "Product Name",
      "role": "StaticText",
    },
    Object {
      "name": "Product Name",
      "role": "textbox",
    },
    Object {
      "name": "Quantity",
      "role": "StaticText",
    },
    Object {
      "name": "Filter",
      "role": "button",
    },
    Object {
      "name": "Quantity",
      "role": "StaticText",
    },
    Object {
      "name": "Quantity",
      "role": "textbox",
    },
    Object {
      "name": "Price",
      "role": "StaticText",
    },
    Object {
      "name": "Filter",
      "role": "button",
    },
    Object {
      "name": "Price",
      "role": "StaticText",
    },
    Object {
      "name": "Price",
      "role": "textbox",
    },
    Object {
      "name": "Order Date",
      "role": "StaticText",
    },
    Object {
      "name": "Filter",
      "role": "button",
    },
    Object {
      "name": "Order Date",
      "role": "StaticText",
    },
    Object {
      "name": ". Press Down arrow to select",
      "role": "StaticText",
    },
    Object {
      "haspopup": "listbox",
      "name": "Order Date . Press Down arrow to select",
      "role": "combobox",
    },
    Object {
      "haspopup": "dialog",
      "name": "Date Picker Trigger",
      "role": "combobox",
    },
    Object {
      "description": "Selection",
      "name": "Select Compressor 0Induction214220",
      "role": "gridcell",
    },
    Object {
      "name": "0",
      "role": "StaticText",
    },
    Object {
      "name": "214220",
      "role": "StaticText",
    },
    Object {
      "name": "Compressor 0",
      "role": "link",
    },
    Object {
      "name": "1",
      "role": "StaticText",
    },
    Object {
      "name": "210.99",
      "role": "StaticText",
    },
    Object {
      "name": "1/1/2015",
      "role": "StaticText",
    },
    Object {
      "checked": false,
      "name": "Select Compressor 1Induction214221",
      "role": "checkbox",
    },
    Object {
      "name": "1",
      "role": "StaticText",
    },
    Object {
      "name": "214221",
      "role": "StaticText",
    },
    Object {
      "name": "Compressor 1",
      "role": "link",
    },
    Object {
      "name": "2",
      "role": "StaticText",
    },
    Object {
      "name": "209.99",
      "role": "StaticText",
    },
    Object {
      "name": "1/2/2015",
      "role": "StaticText",
    },
    Object {
      "checked": false,
      "name": "Select Compressor 2Induction214222",
      "role": "checkbox",
    },
    Object {
      "name": "2",
      "role": "StaticText",
    },
    Object {
      "name": "214222",
      "role": "StaticText",
    },
    Object {
      "name": "Compressor 2",
      "role": "link",
    },
    Object {
      "name": "3",
      "role": "StaticText",
    },
    Object {
      "name": "208.99",
      "role": "StaticText",
    },
    Object {
      "name": "1/3/2015",
      "role": "StaticText",
    },
    Object {
      "checked": false,
      "name": "Select Compressor 3Induction214223",
      "role": "checkbox",
    },
    Object {
      "name": "3",
      "role": "StaticText",
    },
    Object {
      "name": "214223",
      "role": "StaticText",
    },
    Object {
      "name": "Compressor 3",
      "role": "link",
    },
    Object {
      "name": "4",
      "role": "StaticText",
    },
    Object {
      "name": "207.99",
      "role": "StaticText",
    },
    Object {
      "name": "1/4/2015",
      "role": "StaticText",
    },
    Object {
      "checked": false,
      "name": "Select Compressor 4Induction214224",
      "role": "checkbox",
    },
    Object {
      "name": "4",
      "role": "StaticText",
    },
    Object {
      "name": "214224",
      "role": "StaticText",
    },
    Object {
      "name": "Compressor 4",
      "role": "link",
    },
    Object {
      "name": "5",
      "role": "StaticText",
    },
    Object {
      "name": "206.99",
      "role": "StaticText",
    },
    Object {
      "name": "1/5/2015",
      "role": "StaticText",
    },
    Object {
      "checked": false,
      "name": "Select Compressor 5Induction214225",
      "role": "checkbox",
    },
    Object {
      "name": "5",
      "role": "StaticText",
    },
    Object {
      "name": "214225",
      "role": "StaticText",
    },
    Object {
      "name": "Compressor 5",
      "role": "link",
    },
    Object {
      "name": "6",
      "role": "StaticText",
    },
    Object {
      "name": "205.99",
      "role": "StaticText",
    },
    Object {
      "name": "1/6/2015",
      "role": "StaticText",
    },
    Object {
      "checked": false,
      "name": "Select Compressor 6Induction214226",
      "role": "checkbox",
    },
    Object {
      "name": "6",
      "role": "StaticText",
    },
    Object {
      "name": "214226",
      "role": "StaticText",
    },
    Object {
      "name": "Compressor 6",
      "role": "link",
    },
    Object {
      "name": "7",
      "role": "StaticText",
    },
    Object {
      "name": "204.99",
      "role": "StaticText",
    },
    Object {
      "name": "1/7/2015",
      "role": "StaticText",
    },
    Object {
      "checked": false,
      "name": "Select Compressor 7Induction214227",
      "role": "checkbox",
    },
    Object {
      "name": "7",
      "role": "StaticText",
    },
    Object {
      "name": "214227",
      "role": "StaticText",
    },
    Object {
      "name": "Compressor 7",
      "role": "link",
    },
    Object {
      "name": "8",
      "role": "StaticText",
    },
    Object {
      "name": "203.99",
      "role": "StaticText",
    },
    Object {
      "name": "1/8/2015",
      "role": "StaticText",
    },
    Object {
      "checked": false,
      "name": "Select Compressor 8Induction214228",
      "role": "checkbox",
    },
    Object {
      "name": "8",
      "role": "StaticText",
    },
    Object {
      "name": "214228",
      "role": "StaticText",
    },
    Object {
      "name": "Compressor 8",
      "role": "link",
    },
    Object {
      "name": "9",
      "role": "StaticText",
    },
    Object {
      "name": "202.99",
      "role": "StaticText",
    },
    Object {
      "name": "1/9/2015",
      "role": "StaticText",
    },
    Object {
      "checked": false,
      "name": "Select Compressor 9Induction214229",
      "role": "checkbox",
    },
    Object {
      "name": "9",
      "role": "StaticText",
    },
    Object {
      "name": "214229",
      "role": "StaticText",
    },
    Object {
      "name": "Compressor 9",
      "role": "link",
    },
    Object {
      "name": "10",
      "role": "StaticText",
    },
    Object {
      "name": "201.99",
      "role": "StaticText",
    },
    Object {
      "name": "1/10/2015",
      "role": "StaticText",
    },
    Object {
      "disabled": true,
      "name": "First Page",
      "role": "button",
    },
    Object {
      "disabled": true,
      "name": "Previous Page",
      "role": "button",
    },
    Object {
      "name": "Page",
      "role": "StaticText",
    },
    Object {
      "name": "Page of 100",
      "role": "textbox",
      "value": "1",
    },
    Object {
      "name": "of",
      "role": "StaticText",
    },
    Object {
      "name": "100",
      "role": "StaticText",
    },
    Object {
      "name": "Next Page",
      "role": "button",
    },
    Object {
      "name": "Last Page",
      "role": "button",
    },
    Object {
      "haspopup": "menu",
      "name": "10 Records per page",
      "role": "combobox",
    },
  ],
  "name": "IDS Enterprise",
  "role": "RootWebArea",
}
`);
    });
    const validatePagerToolbarText = async (page1, page100) => {
      const pagercountFrom = 'li.pager-count > label > input';
      const pagercountTo = 'li.pager-count > label > span';
      try {
        expect(await page.$eval(pagercountFrom, e => e.value)).toEqual(page1);
        expect(await page.$eval(pagercountTo, e => e.textContent)).toEqual(page100);
        return false;
      } catch (error) {
        return true;
      }
    };
    it('should check pager onClick', async () => {
      const isFailed = [];
      const pagerNext = 'li.pager-next';
      const pagerPrev = 'li.pager-prev';
      const pagerFirst = 'li.pager-first';
      const pagerLast = 'li.pager-last';
      const list = 'table > tbody > tr';

      // verify default
      isFailed.push(await checkIfElementExist(`${pagerFirst} > button[disabled]`));
      isFailed.push(await checkIfElementExist(`${pagerPrev} > button[disabled]`));
      isFailed.push(await checkIfElementExist(pagerNext));
      isFailed.push(await checkIfElementExist(pagerLast));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Compressor 0', 'Compressor 9')); // check if  List's first and last row contains the given value
      isFailed.push(await validatePagerToolbarText('1', '100')); // check if [pager-toolbar] page 1 of 100 contains the given value

      // verify Next page
      await page.click(pagerNext);
      isFailed.push(!await checkIfElementExist(`${pagerFirst} > button[disabled]`));
      isFailed.push(!await checkIfElementExist(`${pagerPrev} > button[disabled]`));
      isFailed.push(await checkIfElementExist(pagerFirst));
      isFailed.push(await checkIfElementExist(pagerPrev));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Compressor 10', 'Compressor 19')); // check if  List's first and last row contains the given value
      isFailed.push(await validatePagerToolbarText('2', '100')); // check if [pager-toolbar] page 2 of 100 contains the given value

      // verify Prev page
      await page.click(pagerPrev);
      isFailed.push(await checkIfElementExist(`${pagerFirst} > button[disabled]`));
      isFailed.push(await checkIfElementExist(`${pagerPrev} > button[disabled]`));
      isFailed.push(await checkIfElementExist(pagerNext));
      isFailed.push(await checkIfElementExist(pagerLast));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Compressor 0', 'Compressor 9')); // check if  List's first and last row contains the given value
      isFailed.push(await validatePagerToolbarText('1', '100')); // check if [pager-toolbar] page 1 of 100 contains the given value

      // verify Last page
      await page.click(pagerLast);
      isFailed.push(await checkIfElementExist(`${pagerNext} > button[disabled]`));
      isFailed.push(await checkIfElementExist(`${pagerLast} > button[disabled]`));
      isFailed.push(await checkIfElementExist(pagerFirst));
      isFailed.push(await checkIfElementExist(pagerPrev));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Compressor 990', 'Compressor 999')); // check if  List's first and last row contains the given value
      isFailed.push(await validatePagerToolbarText('100', '100')); // check if [pager-toolbar] page 100 of 100 contains the given value

      // verify First page
      await page.click(pagerFirst);
      isFailed.push(!await checkIfElementExist(`${pagerNext} > button[disabled]`));
      isFailed.push(!await checkIfElementExist(`${pagerLast} > button[disabled]`));
      isFailed.push(await checkIfElementExist(`${pagerFirst} > button[disabled]`));
      isFailed.push(await checkIfElementExist(`${pagerPrev} > button[disabled]`));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Compressor 0', 'Compressor 9')); // check if  List's first and last row contains the given value
      isFailed.push(await validatePagerToolbarText('1', '100')); // check if [pager-toolbar] page 1 of 100 contains the given value
      expect(isFailed).not.toContain(true); // check if each assertions fails
    });

    it('should check pager using keyboard press', async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
      const isFailed = [];
      const pagerNext = 'li.pager-next';
      const pagerPrev = 'li.pager-prev';
      const pagerFirst = 'li.pager-first';
      const pagerLast = 'li.pager-last';
      const list = 'table > tbody > tr';

      // verify default
      isFailed.push(await checkIfElementExist(`${pagerFirst} > button[disabled]`));
      isFailed.push(await checkIfElementExist(`${pagerPrev} > button[disabled]`));
      isFailed.push(await checkIfElementExist(pagerNext));
      isFailed.push(await checkIfElementExist(pagerLast));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Compressor 0', 'Compressor 9')); // check if  List's first and last row contains the given value
      isFailed.push(await validatePagerToolbarText('1', '100')); // check if [pager-toolbar] page 1 of 100 contains the given value

      // verify Next page
      await page.click('li.pager-count > label > input');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      isFailed.push(!await checkIfElementExist(`${pagerFirst} > button[disabled]`));
      isFailed.push(!await checkIfElementExist(`${pagerPrev} > button[disabled]`));
      isFailed.push(await checkIfElementExist(pagerFirst));
      isFailed.push(await checkIfElementExist(pagerPrev));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Compressor 10', 'Compressor 19')); // check if  List's first and last row contains the given value
      isFailed.push(await validatePagerToolbarText('2', '100')); // check if [pager-toolbar] page 2 of 100 contains the given value

      // verify Prev page
      await page.click('li.pager-count > label > input');
      await page.keyboard.down('Shift');
      await page.keyboard.down('Tab');
      await page.keyboard.up('Shift');
      await page.keyboard.up('Tab');
      await page.keyboard.press('Enter');
      isFailed.push(await checkIfElementExist(`${pagerFirst} > button[disabled]`));
      isFailed.push(await checkIfElementExist(`${pagerPrev} > button[disabled]`));
      isFailed.push(await checkIfElementExist(pagerNext));
      isFailed.push(await checkIfElementExist(pagerLast));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Compressor 0', 'Compressor 9')); // check if  List's first and last row contains the given value
      isFailed.push(await validatePagerToolbarText('1', '100')); // check if [pager-toolbar] page 1 of 100 contains the given value

      // verify Last page
      await page.click('li.pager-count > label > input');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      isFailed.push(await checkIfElementExist(`${pagerNext} > button[disabled]`));
      isFailed.push(await checkIfElementExist(`${pagerLast} > button[disabled]`));
      isFailed.push(await checkIfElementExist(pagerFirst));
      isFailed.push(await checkIfElementExist(pagerPrev));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Compressor 990', 'Compressor 999')); // check if  List's first and last row contains the given value
      isFailed.push(await validatePagerToolbarText('100', '100')); // check if [pager-toolbar] page 100 of 100 contains the given value

      // verify First page
      await page.click('li.pager-count > label > input');
      await page.keyboard.down('Shift');
      await page.keyboard.down('Tab');
      await page.keyboard.down('Tab');
      await page.keyboard.up('Shift');
      await page.keyboard.up('Tab');
      await page.keyboard.up('Tab');
      await page.keyboard.press('Enter');
      await page.click(pagerFirst);
      isFailed.push(!await checkIfElementExist(`${pagerNext} > button[disabled]`));
      isFailed.push(!await checkIfElementExist(`${pagerLast} > button[disabled]`));
      isFailed.push(await checkIfElementExist(`${pagerFirst} > button[disabled]`));
      isFailed.push(await checkIfElementExist(`${pagerPrev} > button[disabled]`));
      isFailed.push(await checkListItem_1stnLastValue(list, 'Compressor 0', 'Compressor 9')); // check if  List's first and last row contains the given value
      isFailed.push(await validatePagerToolbarText('1', '100')); // check if [pager-toolbar] page 1 of 100 contains the given value
      expect(isFailed).not.toContain(true); // check if each assertions fails
    });

    it('should change records per page', async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });
      const pageSize = 'li.pager-pagesize > button > span';
      const lastRow = 'table > tbody > tr';

      // verify 25 records per page
      await page.click(pageSize);
      await page.click('#popupmenu-3 > li:nth-child(2) > a');
      await page.waitForTimeout(300);
      expect((await page.$$(lastRow)).length).toBe(25);

      // verify 50 records per page
      await page.click(pageSize);
      await page.click('#popupmenu-3 > li:nth-child(3)');
      await page.waitForTimeout(300);
      expect((await page.$$(lastRow)).length).toBe(50);

      // verify 75 records per page
      await page.click(pageSize);
      await page.click('#popupmenu-3 > li:nth-child(4)');
      await page.waitForTimeout(300);
      expect((await page.$$(lastRow)).length).toBe(75);

      // verify 10 records per page
      await page.click(pageSize);
      await page.click('#popupmenu-3 > li:nth-child(1)');
      await page.waitForTimeout(300);
      expect((await page.$$(lastRow)).length).toBe(10);
    });
  });
});
