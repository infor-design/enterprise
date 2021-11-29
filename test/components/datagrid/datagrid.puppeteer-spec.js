describe('Datagrid Puppeteer Tests', () => {
  describe('Datagrid Filter Format Test', () => {
    const url = 'http://localhost:4000/components/datagrid/example-filter.html';

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
    const url = 'http://localhost:4000/components/datagrid/example-custom-filter-conditions-and-defaults.html';

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('Check default selected options', async () => {
      await page.click('#example-custom-filter-conditions-and-defaults-datagrid-1-header-0 .datagrid-filter-wrapper button');

      expect(await page.waitForSelector('.contains.is-selectable', { visible: true })).toBeTruthy();
      expect(await page.waitForSelector('.equals.is-selectable.is-checked', { visible: true })).toBeTruthy();
    });
  });
});

describe('Datagrid test-tree-rowstatus tests', () => {
  const url = 'http://localhost:4000/components/datagrid/test-tree-rowstatus.html';
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

fdescribe('Datagrid custom filter tests', () => {
  const url = 'http://localhost:4000/components/datagrid/example-custom-filter-conditions-and-defaults.html';
  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

  it('should see the Id column defaults to equal onload', async () => {
    const filter = await page.$eval('button.btn-menu.btn-filter',
      element => element.getAttribute('data-default'));
    expect(filter).toEqual('equals');
  });

  it('should open the filter', async () => {
    await page.click('button.btn-menu.btn-filter');
    const filterCheck = await page.$eval('button.btn-menu.btn-filter',
      element => element.getAttribute('class'));
    expect(filterCheck).toContain('is-open');
  });

  it('should see the Equal filter is checked after clicking Id filter', async () => {
    const isChecked = await page.$eval('li.equals',
      element => element.getAttribute('class'));
    expect(isChecked).toContain('is-checked');
  });

  it('should select other filter', async () => {
    await page.click('li.contains.is-selectable');
    //await page.evaluate(()=>document.querySelector('li.contains').click());
    await page.click('button.btn-menu.btn-filter');
    await page.waitForTimeout(200);
    const isClicked = await page.$eval('li.contains',
      element => element.getAttribute('class'));
    //expect(isClicked).toContain('is-checked');
    console.log(isClicked);
  });
});
