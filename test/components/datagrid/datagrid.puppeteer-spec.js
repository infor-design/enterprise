const { getConfig, getComputedStyle } = require('../../helpers/e2e-utils.js');

describe('Datagrid Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/datagrid';

  describe('Datagrid Filter Format Test', () => {
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

    it('Date filter should follow specified date format (YYYYMMDD)', async () => {
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

  describe('Datagrid Filter Custom Filter Conditions', () => {
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

  describe('Datagrid test-tree-rowstatus tests', () => {
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

  describe('Datagrid example-key-row-select tests', () => {
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

  describe('Datagrid test to keep the column strech in responsive view', () => {
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

  describe('Datagrid test count in select all tests', () => {
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
      await page.waitForSelector('.pager-toolbar', { visible: true });
      await page.waitForSelector('.btn-menu', { visible: true });
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

  describe('Datagrid add support for fallback image tootip text test', () => {
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

  describe.only('Datagrid', () => {
    const url = `${baseUrl}/test-update-column.html`;
    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should refresh column', async () => {
      await page.waitForSelector('.btn hide-focus');
      await page.click('btn hide-focus');
      await page.waitForSelector('.btn hide-focus .is-selected');
    });
  });
});
