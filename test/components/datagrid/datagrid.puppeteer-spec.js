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
});
