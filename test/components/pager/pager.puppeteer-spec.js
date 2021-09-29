const { compareInnerHTML, checkDataAutomationID, isExist, checkClassName, checkTooltip } = require('../../helpers/e2e-utils.js');

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
      expect(isFailed).not.toContain('true');
    });

    it('should toggle page size selector', async () => {
      // TODO
      const isFailed = [];

      const pagesizeButton = '#standalone-pager-btn-pagesize';
      const disabledCheckbox = 'input[disabled]';
      isFailed.push(!await isExist(pagesizeButton)); // 10 records per page button
      isFailed.push(await isExist(disabledCheckbox)); // disabled checkboxes

      // verify pagesize button should be displayed and checkboxes should not be disabled
      await page.click('#toggle-pagesize');
      isFailed.push(await isExist(pagesizeButton));
      isFailed.push(!await isExist('input[disabled]'));

      expect(isFailed).not.toContain(true);
    });

    it('should Use Small Page Size Selector', async () => {
      // TODO
      const isFailed = [];
      const pagesizeButton = '#standalone-pager-btn-pagesize';

      // verify Use Small Page Size Selector  when clicked it should show 10
      await page.click('#toggle-pagesize');
      isFailed.push(await compareInnerHTML(pagesizeButton, '<span>10 Records per page</span>'));
      await page.click('#toggle-small-pagesize');
      isFailed.push(await compareInnerHTML(pagesizeButton, '<span class="record-count">10</span>'));
      isFailed.push(await compareInnerHTML(pagesizeButton, '<span class="audible">Records per page</span>'));
      expect(isFailed).not.toContain(true);
    });

    it('should Attach Page Size Menu To Body', async () => {
      // TODO
      const isFailed = [];
      await page.click('#toggle-pagesize');
      await page.click('#toggle-small-pagesize');
      const pagerContainer = '#standalone-pager > li.pager-pagesize > div';
      const bodyContainer = 'body > div.popupmenu-wrapper.bottom > ul#popupmenu-2';

      // verify Attach Page Size Menu To Body
      isFailed.push(await isExist(pagerContainer));
      await page.click('#toggle-attach-to-body');
      isFailed.push(await isExist(bodyContainer));
      expect(isFailed).not.toContain(true);
    });

    it('should hide/show nav buttons', async () => {
      // TODO
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
      isFailed.push(await isExist(firstPager));
      await hidefirstCheckbox.click();
      isFailed.push(!await isExist(firstPager));
      await hidefirstCheckbox.click();
      isFailed.push(await isExist(firstPager));

      // hide/show previous Nav button
      isFailed.push(await isExist(previousPager));
      await hidepreviousCheckbox.click();
      isFailed.push(!await isExist(previousPager));
      await hidepreviousCheckbox.click();
      isFailed.push(await isExist(previousPager));

      // hide/show next Nav button
      isFailed.push(await isExist(nextPager));
      await hidenextCheckbox.click();
      isFailed.push(!await isExist(nextPager));
      await hidenextCheckbox.click();
      isFailed.push(await isExist(nextPager));

      // hide/show last Nav button
      isFailed.push(await isExist(lastPager));
      await hidelastCheckbox.click();
      isFailed.push(!await isExist(lastPager));
      await hidelastCheckbox.click();
      isFailed.push(await isExist(lastPager));
      expect(isFailed).not.toContain(true);
    });

    it('should enable/disable navbuttons', async () => {
      // TODO
      const isFailed = [];
      const disableFirst = await page.$('#disable-first-button');
      const disablePrev = await page.$('#disable-previous-button');
      const disableNext = await page.$('#disable-next-button');
      const disableLast = await page.$('#disable-last-button');

      // enable/disable first nav button
      isFailed.push(await checkClassName('.pager-first', 'pager-first'));
      await disableFirst.click();
      isFailed.push(await checkClassName('.pager-first', 'pager-first is-disabled'));

      // enable/disable prev nav button
      isFailed.push(await checkClassName('.pager-prev', 'pager-prev'));
      await disablePrev.click();
      isFailed.push(await checkClassName('.pager-prev', 'pager-prev is-disabled'));

      // enable/disable next nav button
      isFailed.push(await checkClassName('.pager-next', 'pager-next'));
      await disableNext.click();
      isFailed.push(await checkClassName('.pager-next', 'pager-next is-disabled'));

      // enable/disable last nav button
      isFailed.push(await checkClassName('.pager-last', 'pager-last'));
      await disableLast.click();
      isFailed.push(await checkClassName('.pager-last', 'pager-last is-disabled'));
      expect(isFailed).not.toContain(true);
    });

    it('should show Page Selector Input', async () => {
      const isFailed = [];
      const showpageselectorinputCheckbox = await page.$('#show-page-selector-input');

      isFailed.push(await checkClassName('.pager-first', 'pager-first'));
      isFailed.push(await checkClassName('.pager-prev', 'pager-prev'));
      await showpageselectorinputCheckbox.click();
      isFailed.push(await checkClassName('.pager-first', 'pager-first is-disabled'));
      isFailed.push(await checkClassName('.pager-prev', 'pager-prev is-disabled'));
      isFailed.push(await isExist('.pager-count'));

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
      isFailed.push(await checkTooltip(firstPager, tooltip, tooltipContent, 'Custom First Tooltip'));
      await firstpageInput.click({ clickCount: 3 });
      await firstpageInput.type('The quick brown fox jumps over the lazy dog');
      await firstpageInput.press('Enter');
      isFailed.push(await checkTooltip(firstPager, tooltip, tooltipContent, 'The quick brown fox jumps over the lazy dog'));

      // set tooltip for Previous Pager Button Tooltip
      isFailed.push(await checkTooltip(previousPager, tooltip, tooltipContent, 'Custom Previous Tooltip'));
      await previouspageInput.click({ clickCount: 3 });
      await previouspageInput.type('Jaded zombies acted quaintly but kept driving their oxen forward');
      await previouspageInput.press('Enter');
      isFailed.push(await checkTooltip(previousPager, tooltip, tooltipContent, 'Jaded zombies acted quaintly but kept driving their oxen forward'));

      // set tooltip for Next Pager Button Tooltip
      isFailed.push(await checkTooltip(nextPager, tooltip, tooltipContent, 'Custom Next Tooltip'));
      await nextpageInput.click({ clickCount: 3 });
      await nextpageInput.type('Portez ce vieux whisky au juge blond qui fume');
      await nextpageInput.press('Enter');
      isFailed.push(await checkTooltip(nextPager, tooltip, tooltipContent, 'Portez ce vieux whisky au juge blond qui fume'));

      // set tooltip for Last Pager Button Tooltip
      isFailed.push(await checkTooltip(lastPager, tooltip, tooltipContent, 'Custom Last Tooltip'));
      await lastpageInput.click({ clickCount: 3 });
      await lastpageInput.type('Ang bawat rehistradong kalahok sa patimpalak ay umaasang magantimpalaan ng ñino');
      await lastpageInput.press('Enter');
      isFailed.push(await checkTooltip(lastPager, tooltip, tooltipContent, 'Ang bawat rehistradong kalahok sa patimpalak ay umaasang magantimpalaan ng ñino'));

      // Reset Tooltips
      await resetTooltip.click();
      isFailed.push(await checkTooltip(firstPager, tooltip, tooltipContent, 'Custom First Tooltip'));
      isFailed.push(await checkTooltip(previousPager, tooltip, tooltipContent, 'Custom Previous Tooltip'));
      isFailed.push(await checkTooltip(nextPager, tooltip, tooltipContent, 'Custom Next Tooltip'));
      isFailed.push(await checkTooltip(lastPager, tooltip, tooltipContent, 'Custom Last Tooltip'));
      expect(isFailed).not.toContain(true);
    }, 13000);
  });
});
