/* eslint-disable compat/compat */
const path = require('path');
const { getConfig, getComputedStyle } = require('../../helpers/e2e-utils.cjs');

describe('Datagrid', () => {
  const baseUrl = 'http://localhost:4000/components/datagrid';

  describe('Filter Format', () => {
    const url = `${baseUrl}/example-filter.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('Date filter should follow specified date format (MM/dd/yyyy)', async () => {
      const dateFilter = await page.$('#custom-id-filter-orderdate');
      expect(await page.evaluate(el => el.value, dateFilter)).toEqual('');

      await dateFilter.press('ArrowDown');
      page.waitForSelector('.monthview-popup.is-open', { visible: true });
      await page.click('.monthview-table td:not(.alternate).is-selected');

      const testDate = new Date();

      expect(await page.evaluate(el => el.value, dateFilter)).toEqual(`${testDate.getMonth() + 1}/${testDate.getDate()}/${testDate.getFullYear()}`);
    });

    it.skip('Date filter should follow specified date format (YYYYMMDD)', async () => {
      const dateFilter = await page.$('#custom-id-filter-orderotherdate');
      expect(await page.evaluate(el => el.value, dateFilter)).toEqual('');

      await dateFilter.press('ArrowDown');
      page.waitForSelector('.monthview-popup.is-open', { visible: true });
      await page.click('.monthview-table td:not(.alternate).is-selected');

      const testDate = new Date();
      const testMonth = (testDate.getMonth() + 1) < 10 ? `0${testDate.getMonth() + 1}` : testDate.getMonth() + 1;
      const testDay = testDate.getDate() < 10 ? `0${testDate.getDate()}` : testDate.getDate();

      expect(await page.evaluate(el => el.value, dateFilter)).toEqual(`${testDate.getFullYear()}${testMonth}${testDay}`);
    });
  });

  describe('Filter Custom Filter Conditions', () => {
    const url = `${baseUrl}/example-custom-filter-conditions-and-defaults.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('Check default selected options', async () => {
      await page.click('#example-custom-filter-conditions-and-defaults-datagrid-1-header-0 .datagrid-filter-wrapper button');

      expect(await page.waitForSelector('.contains.is-selectable', { visible: true })).toBeTruthy();
      expect(await page.waitForSelector('.equals.is-selectable.is-checked', { visible: true })).toBeTruthy();
    });
  });

  describe('Inline Editor', () => {
    const url = `${baseUrl}/test-editable-with-inline-editor.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('Should have inline editors', async () => {
      await page.waitForSelector('.has-inline-editor', { visible: true })
        .then(element => expect(element).toBeTruthy());
    });

    it('Should be able to clean editors on click and backspace', async () => {
      await page.waitForSelector('.has-inline-editor', { visible: true })
        .then(element => expect(element).toBeTruthy());

      await page.waitForSelector('#datagrid-inline-input-1-2', { visible: true })
        .then(element => expect(element).toBeTruthy());

      await page.click('#datagrid-inline-input-1-2');

      await page.keyboard.press('Backspace');
      expect(await page.$eval('#datagrid-inline-input-1-2', el => el.value)).toBe('');
    });
  });

  describe('Tree row status', () => {
    const url = `${baseUrl}/test-tree-rowstatus.html`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('Should add and remove row status when button is toggled', async () => {
      await page.click('#toggle-row-status');
      const row = await page.waitForSelector('.icon-rowstatus', { visible: true });
      expect(row).toBeTruthy();
      await page.click('#toggle-row-status');
      const rowRemove = await page.waitForSelector('.icon-rowstatus', { hidden: true });
      expect(rowRemove).toBeFalsy();
    });

    it('Should show row status when + is toggled', async () => {
      await page.click('#toggle-row-status');
      await page.waitForSelector('tr.datagrid-row.datagrid-tree-child.rowstatus-row-info', { hidden: true });
      const ariaExpanded1 = await page.$eval('tr.datagrid-row.datagrid-tree-parent', element => element.getAttribute('aria-expanded'));
      expect(ariaExpanded1).toMatch('false');

      await page.click('.datagrid-expand-btn');
      const ariaExpanded2 = await page.$eval('tr.datagrid-row.datagrid-tree-parent', element => element.getAttribute('aria-expanded'));
      expect(ariaExpanded2).toMatch('true');

      const status = await page.waitForSelector('tr.datagrid-row.datagrid-tree-child.rowstatus-row-info', { visible: true });
      expect(status).toBeTruthy();
    });
  });

  describe('Tree Filter Empty', () => {
    const url = `${baseUrl}/test-tree-filter.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to use filter empty without text in input box', async () => {
      expect(await page.$$eval('tr.datagrid-row', el => el.length)).toEqual(22);

      const filterBtn = await page.$('#test-tree-filter-datagrid-1-header-3 .btn-filter');
      await filterBtn.click();

      await page.waitForSelector('.popupmenu.is-open', { visible: true })
        .then(element => expect(element).toBeTruthy());

      await page.waitForSelector('.popupmenu.is-open li.is-empty', { visible: true })
        .then(element => expect(element).toBeTruthy());

      const isEmptyBtn = await page.$('.popupmenu.is-open li.is-empty');
      await isEmptyBtn.click();

      expect(await page.$$eval('tr.datagrid-row.is-hidden', el => el.length)).toEqual(7);
      expect(await page.$$eval('tr.datagrid-row:not(.is-hidden)', el => el.length)).toEqual(1);
    });
  });

  describe('Key row select', () => {
    const url = `${baseUrl}/example-key-row-select.html`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('Should be able to use arrow keys for row selection', async () => {
      await page.click('tr.datagrid-row');
      const row1 = await page.$eval('tr.datagrid-row.is-selected', element => element.getAttribute('class'));
      expect(row1).toEqual('datagrid-row is-hover-row is-clickable is-active-row is-selected');

      await page.keyboard.press('ArrowDown');
      const row2 = await page.$eval('tr.datagrid-row.is-selected', element => element.getAttribute('class'));
      expect(row2).toEqual('datagrid-row is-active-row is-selected');
    });
  });

  describe('Index', () => {
    const url = `${baseUrl}/example-index.html`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should run visual test in responsive view', async () => {
      await page.setViewport({ width: 900, height: 600 });
      await page.waitForSelector('#custom-id-col-phone');
      const img = await page.screenshot();
      const config = getConfig('datagrid-col');
      expect(img).toMatchImageSnapshot(config);
    });
  });

  describe('Count in select all current page setting', () => {
    const url = `${baseUrl}/test-count-in-select-all-current-page-setting.html`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    const isNotVisible = async (selector) => {
      const display = await getComputedStyle(selector, 'display');
      const visibilty = await getComputedStyle(selector, 'visibility');
      expect(display).toBe('none');
      expect(visibilty).toBe('hidden');
    };

    it('Should hide the pager when you select pagesize to 100', async () => {
      await page.waitForSelector('.pager-toolbar');
      await page.waitForSelector('.btn-menu');
      await page.click('.btn-menu');
      await page.click('#popupmenu-4 > li:nth-child(5) > a');

      const hiddenElems = (await page.$$('ul.pager-toolbar > li.hidden')).length;
      expect(hiddenElems).toBe(5);

      // hide only the pager
      await isNotVisible('ul > li.pager-first');
      await isNotVisible('ul > li.pager-prev');
      await isNotVisible('ul > li.pager-count');
      await isNotVisible('ul > li.pager-next');
      await isNotVisible('ul > li.pager-last');
      // and not the pagesize selector.
      const pageSizeselector = await getComputedStyle('ul > li.pager-pagesize', 'visibility');
      expect(pageSizeselector).toBe('visible');
    });
  });

  describe('Images error', () => {
    const url = `${baseUrl}/test-images-error.html`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show a tooltip after hovering the image', async () => {
      await page.hover('svg.icon.has-tooltip');
      const tooltip = await page.waitForSelector('.has-open-tooltip');
      expect(tooltip).toBeTruthy();
    });
  });

  describe('Update column', () => {
    const url = `${baseUrl}/test-update-column.html`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should refresh column', async () => {
      await page.waitForSelector('#load-activity');
      const firstValue = await page.evaluate(() => document.getElementsByClassName('datagrid-cell-wrapper')[6].innerText);
      await page.click('#load-activity');
      const secondValue = await page.evaluate(() => document.getElementsByClassName('datagrid-cell-wrapper')[6].innerText);
      expect(firstValue).not.toEqual(secondValue);
    });
  });

  describe('Add row selected', () => {
    const url = `${baseUrl}/test-addrow-selected.html`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should have method for cell editing for new row added', async () => {
      await page.waitForSelector('#add-row-button');
      await page.click('#add-row-button');

      const focusedEl = await page.evaluateHandle(() => document.activeElement);
      await focusedEl.type('ttest', { delay: 1000 });
      await page.waitForTimeout(200);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);

      const input = await page.$('.datagrid-row:nth-child(1) > .has-editor:nth-child(2) > .datagrid-cell-wrapper');
      await page.waitForTimeout(200);
      const value = await page.evaluate(el => el.textContent, input);
      expect(value).toContain('test');
    });
  });

  describe('Test with tree checkbox', () => {
    const url = `${baseUrl}/test-tree-with-checkbox.html`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should expand the treegrid via keyboard whenn editable is set to true', async () => {
      // Tab three times to focus on the expand button
      for (let i = 0; i < 3; i++) {
        page.keyboard.press('Tab');
      }
      await page.keyboard.press('Space');

      await page.evaluate(() => document.querySelector('.datagrid-expand-btn').getAttribute('class'))
        .then(el => expect(el).toContain('is-expanded'));
    });
  });

  describe('Landmark', () => {
    const url = `${baseUrl}/test-landmark`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should override the aria-describedby value', async () => {
      const ariaDesc = await page.$$eval(
        'tbody[role="rowgroup"] td[role="gridcell"]:nth-child(2)',
        e => e.map(el => el.getAttribute('aria-describedby'))
      );

      for (let i = 0; i < ariaDesc.length; i++) {
        expect(ariaDesc).toContain(`test-landmark-datagrid-${i + 1}-header-1`);
      }
    });
  });

  describe('Header icon with tooltip', () => {
    const url = `${baseUrl}/example-header-icon-with-tooltip`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the info icon in header column', async () => {
      expect(await page.waitForSelector('.datagrid', { visible: true })).toBeTruthy();
      expect(await page.waitForSelector('.icon.datagrid-header-icon', { visible: true })).toBeTruthy();
    });

    it('should show the tooltip content on mouse hover', async () => {
      const headerIcon = await page.$('.datagrid-header-icon');
      headerIcon.hover();
      await page.waitForSelector('.grid-tooltip:not(.is-hidden)', { visible: true })
        .then(el => expect(el).toBeTruthy());
    });

    it('should have a custom class in the column header', async () => {
      await page.evaluate(() => document.getElementById('example-header-icon-with-tooltip-datagrid-1-header-2').getAttribute('class'))
        .then(el => expect(el).toContain('lm-custom-class-header'));
    });

    it('should show the tooltip content upon changing row height', async () => {
      await page.setViewport({ width: 1920, height: 1080 });

      await page.click('#maincontent > div.row > div > div.toolbar.has-more-button.do-resize.has-title > div.more > button');
      await page.click('#popupmenu-2 > li:nth-child(4)');

      // wait for element before trying to hover
      await page.waitForSelector('#example-header-icon-with-tooltip-datagrid-1-header-2 .datagrid-header-icon');
      await page.hover('#example-header-icon-with-tooltip-datagrid-1-header-2 .datagrid-header-icon');

      await page.click('#example-header-icon-with-tooltip-datagrid-1-header-2 .datagrid-header-text')
        .then(() => page.hover('#example-header-icon-with-tooltip-datagrid-1-header-2 > div.datagrid-column-wrapper > svg'));

      // get the tooltip content and verify if product name exist
      await page.waitForSelector('.tooltip-content.header-icon', { visible: true })
        .then(el => expect(el).toBeTruthy());
      const tooltip = await page.$('.tooltip-content.header-icon');
      const tooltipContent = await page.evaluate(el => el.textContent, tooltip);
      expect(tooltipContent).toContain('Product Name');
    });
  });

  describe('Can add multiple rows', () => {
    const url = `${baseUrl}/test-selected-rows-addnew.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should add new row on button click', async () => {
      await page.click('#add-row-top-btn');
      const ariaRowTop = await page.$eval('tr.datagrid-row.rowstatus-row-new.is-tooltips-enabled', element => element.getAttribute('aria-rowindex'));
      expect(ariaRowTop).toMatch('1');
      await page.click('.toolbar.has-more-button .btn-actions:not(.page-changer)');
      await page.waitForSelector('#popupmenu-2.is-open', { visible: true });
      await page.hover('#popupmenu-2 > li:nth-child(3) > a');
      await page.click('#popupmenu-2 > li:nth-child(3) > a');
      const ariaRowT4 = await page.$eval('tr.datagrid-row.rowstatus-row-new.is-tooltips-enabled', element => element.getAttribute('aria-rowindex'));
      expect(ariaRowT4).toMatch('4');
    });
  });

  describe('Datagrid test to render only one row', () => {
    const url = `${baseUrl}/test-hide-pager-if-one-page.html`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should re-renders all the row element when you add a new row', async () => {
      await page.waitForSelector('#add-btn');
      await page.click('#add-btn');

      await page.waitForSelector('#datagrid > div > table.datagrid > tbody > tr > td:nth-child(5) > div');

      const value = await page.$eval('#datagrid > div > table.datagrid > tbody > tr > td:nth-child(5) > div', element => element.innerHTML);
      expect(value).toEqual('0');

      await page.$eval('#datagrid > div > table.datagrid > tbody > tr > td:nth-child(5) > div', (el) => {
        el.innerHTML = '4';
      });

      await page.waitForTimeout(200);
      await page.click('#add-btn');
      const newValue = await page.$eval('#datagrid > div.datagrid-wrapper.center.scrollable-x.scrollable-y > table > tbody > tr:nth-child(2) > td:nth-child(5) > div', element => element.innerHTML);

      expect(newValue).toEqual('4');
    });
  });

  describe('Column width', () => {
    const url = `${baseUrl}/test-column-size`;
    let windowSize;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      windowSize = await page.viewport();
    });

    afterAll(async () => {
      await page.setViewport(windowSize);
    });

    it('should not have inline width when no column width is specified', async () => {
      await page.setViewport({ width: 600, height: 600 });
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });

      await page.click('#show-model');

      await page.waitForSelector('#modal-content', { visible: true })
        .then(elHandle => elHandle.$('table.datagrid'))
        .then(async (elHandle) => {
          await page.waitForTimeout(400);
          return elHandle.evaluate(e => e.getAttribute('style'));
        })
        .then(style => expect(style).toBeFalsy());
    });

    it('should have inline width when column width is specified and screen is small', async () => {
      await page.setViewport({ width: 600, height: 600 });
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });

      await page.$eval('#width', (el) => { el.value = '35'; });
      await page.click('#show-model');

      await page.waitForSelector('#modal-content', { visible: true })
        .then(elHandle => elHandle.$('table.datagrid'))
        .then(async (elHandle) => {
          await page.waitForTimeout(400);
          return elHandle.evaluate(e => e.getAttribute('style'));
        })
        .then(style => expect(style).toContain('width'));
    });
  });

  describe('Allow beforeCommitCellEdit event test', () => {
    const url = `${baseUrl}/test-editable-fileupload-before-commitcelledit`;
    const fileName = 'test.txt';
    const filePath = path.resolve(__dirname, fileName);
    const uploadFiles = async (filePathArr) => {
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click('#datagrid  table > tbody > tr:nth-child(1) > td.datagrid-trigger-cell.is-fileupload.has-editor > div > svg')
      ]);
      return fileChooser.accept(filePathArr);
    };

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should upload a file and show a fake path', async () => {
      await uploadFiles([filePath]);
      await page.waitForSelector('.icon-close', { visible: true });
      await page.waitForSelector('table > tbody > tr:nth-child(1) > td.datagrid-trigger-cell.is-fileupload.has-editor > div', { visible: true })
        .then(async (element) => {
          const fakePath = await element.$eval('#datagrid > div.datagrid-wrapper.center.scrollable-x.scrollable-y > table > tbody > tr:nth-child(1) > td.datagrid-trigger-cell.is-fileupload.has-editor > div > span', e => e.textContent);
          expect(fakePath).toEqual(`C:\\fakepath\\${fileName}`);
        });
    });
  });

  describe('Edit cells', () => {
    const url = `${baseUrl}/example-editable`;

    it('should update number to correct value in different locale', async () => {
      const localeUrl = `${url}?locale=de-DE`;
      await page.goto(localeUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });

      const priceCell = await page.$('#datagrid table > tbody > tr:nth-child(1) > td:nth-child(7)');
      await priceCell.click();
      await priceCell.type('1,5');
      await page.keyboard.press('Enter');
      await priceCell.evaluate(el => el.textContent).then(text => expect(text).toEqual('1,500'));

      await priceCell.click();
      await page.keyboard.press('Enter');
      await priceCell.evaluate(el => el.textContent).then(text => expect(text).toEqual('1,500'));
    });
  });

  describe('Extra class for tooltip tests', () => {
    const url = `${baseUrl}/example-header-icon-with-tooltip`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show tooltip when hovered', async () => {
      const th = 'example-header-icon-with-tooltip-datagrid-1-header-2';
      await page.hover(`#${th}`);

      await page.waitForSelector('#example-header-icon-with-tooltip-datagrid-0tooltip', { visible: true })
        .then(element => element.getProperty('className'))
        .then(className => className.jsonValue())
        .then(classNameString => expect(classNameString).not.toContain('is-hidden'));
    });

    it('should show tooltip when hovered (headers)', async () => {
      await page.hover('.icon.datagrid-header-icon');

      await page.waitForSelector('#example-header-icon-with-tooltip-datagrid-0tooltip', { visible: true })
        .then(element => element.getProperty('className'))
        .then(className => className.jsonValue())
        .then(classNameString => expect(classNameString).toContain('tooltip-extra-class'));
    });
  });

  describe('Mixed Sort Case', () => {
    const url = `${baseUrl}/test-combo-sort.html`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should be able to use filter properly', async () => {
      expect(await page.$eval('tr.datagrid-row:nth-child(1) td:nth-child(2) a', el => el.innerHTML)).toBe('01AM');

      await page.click('th:nth-child(2) span.sort-asc');
      expect(await page.$eval('tr.datagrid-row:nth-child(1) td:nth-child(2) a', el => el.innerHTML)).toBe('1');

      await page.click('th:nth-child(2) span.sort-desc');
      expect(await page.$eval('tr.datagrid-row:nth-child(1) td:nth-child(2) a', el => el.innerHTML)).toBe('10CD');
    });
  });
});
